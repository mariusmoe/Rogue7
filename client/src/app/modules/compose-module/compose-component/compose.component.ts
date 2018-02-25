// #region Imports

import {
	Component, OnDestroy, ViewChild, ChangeDetectionStrategy,
	ViewContainerRef, PLATFORM_ID, Inject
} from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, CanDeactivate } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

import { ModalData } from '@app/models';
import { MatDialog, MatDialogConfig, MatSelectChange } from '@angular/material';
import { ModalComponent } from '@app/modules/shared-module/modals/modal.component';

import { CMSService, AuthService, MobileService } from '@app/services';
import { CmsContent, CmsAccess, AccessRoles } from '@app/models';

import { CKEditorComponent } from '../ckeditor-component/ckeditor.component';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { takeUntil, debounceTime } from 'rxjs/operators';

// #endregion

enum VersionHistory {
	Draft = -1
}

@Component({
	selector: 'compose-component',
	templateUrl: './compose.component.html',
	styleUrls: ['./compose.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComposeComponent implements OnDestroy, CanDeactivate<ComposeComponent> {
	// #region Public fields

	public contentForm: FormGroup; // Form
	public originalContent: CmsContent; // When editing, the original content is kept here
	// Access
	public AccessRoles = AccessRoles;
	public accessChoices: CmsAccess[] = [
		{ value: AccessRoles.everyone, verbose: 'Everyone', icon: 'group' },
		{ value: AccessRoles.user, verbose: 'Users', icon: 'verified_user' },
		{ value: AccessRoles.admin, verbose: 'Admins', icon: 'security' }
	];
	// Folders: Holds a list of used Folders
	public folders: string[] = [];
	// History fields
	public versionIndex: number = VersionHistory.Draft;
	public history: CmsContent[] = null;

	// #endregion

	// #region Private fields

	@ViewChild(CKEditorComponent) editor: CKEditorComponent;
	private currentDraft: CmsContent; // used with the versioning

	private ngUnsubscribe = new Subject();
	private hasSaved = false;

	// #endregion

	// #region Constructor

	constructor(
		@Inject(PLATFORM_ID) private platformId: Object,
		private router: Router,
		private route: ActivatedRoute,
		private fb: FormBuilder,
		private dialog: MatDialog,
		public cmsService: CMSService,
		public mobileService: MobileService,
		public authService: AuthService) {

		// Do not load on the server. Only load for browser applications.
		if (!isPlatformBrowser(platformId)) { return; }


		// Form
		this.contentForm = fb.group({
			'route': ['', this.disallowed(cmsService.getContentList(), 'route').bind(this)],
			'title': ['', this.disallowed(cmsService.getContentList(), 'title').bind(this)],
			'description': ['', Validators.required],
			'access': [AccessRoles.everyone, Validators.required],
			'nav': [true],
			'folder': [''],
			'content': ['', Validators.required],
		});
		this.currentDraft = this.contentForm.getRawValue();

		// Hook (non-dirty) route to title.
		const routeEdit = this.contentForm.get('route'), titleEdit = this.contentForm.get('title');
		let oldTitleValue = titleEdit.value;
		this.contentForm.get('title').valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(newVal => {
			// Update routeEdit IFF the user specifically edits title without having touched route, and the values are equal
			if (titleEdit.dirty && !routeEdit.dirty && !routeEdit.disabled && (oldTitleValue == routeEdit.value)) {
				routeEdit.setValue(newVal);
			}
			oldTitleValue = newVal;
		});

		// Hook form change
		this.contentForm.valueChanges.pipe(takeUntil(this.ngUnsubscribe), debounceTime(10)).subscribe((newVal: CmsContent) => {
			if (this.versionIndex === VersionHistory.Draft) {
				this.currentDraft = newVal;
			}
		});

		// Create Folder autocomplete list
		this.cmsService.getContentList().pipe(takeUntil(this.ngUnsubscribe)).subscribe(contentList => {
			if (!contentList) { return; }
			const folders: string[] = [];
			for (const content of contentList) {
				if (content.folder && folders.indexOf(content.folder) === -1) {
					folders.push(content.folder);
				}
			}
			this.folders = folders.sort();
		});

		// Router: Check if we are editing or creating content
		const editingContentRoute = route.snapshot.params['route'];
		if (!editingContentRoute) { return; }

		this.cmsService.requestContent(editingContentRoute).subscribe(data => {
			this.originalContent = data;
			this.currentDraft = data;

			this.contentForm.patchValue(data);
			this.setFormDisabledState();

			this.editor.Value = data.content;
		}, err => {
			router.navigateByUrl('/compose');
		});

		this.cmsService.requestContentHistory(editingContentRoute).subscribe(historyList => {
			this.history = historyList;
		});
	}

	// #endregion

	// #region Event handlers

	/**
	 * Event handler for when the editor value changes.
	 * @param newValue
	 */
	public editorChanged(newValue: string) {
		this.contentForm.get('content').setValue(newValue);
	}

	/**
	 * Event handler for when the currently viewed version changes
	 * @param event
	 */
	public versionChange(event: MatSelectChange) {
		const c = this.history ? this.history[event.value] : null;

		if (c) {
			this.contentForm.patchValue(c, { emitEvent: false });
			this.editor.Value = c.content;
			this.contentForm.disable();
			this.editor.isReadOnly = true;
			return;
		}

		this.contentForm.patchValue(this.currentDraft, { emitEvent: false });
		this.editor.Value = this.currentDraft.content;
		this.contentForm.enable();
		this.editor.isReadOnly = false;
		this.setFormDisabledState();
	}

	// #endregion

	// #region Interface implementations

	ngOnDestroy() {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	/**
	 * Implements interface: CanDeactivate<ComposeComponent>
	 */
	canDeactivate() {
		// if we've saved, we're fine deactivating!
		if (this.hasSaved) { return true; }

		// if we're not dirty, we can also deactivate
		if (!this.contentForm.dirty) { return true; }

		const answer = new Subject<boolean>();

		const data: ModalData = {
			headerText: 'Unsaved work!',
			bodyText: 'Do you wish to proceed without saving?',
			proceedColor: 'accent', proceedText: 'Proceed',
			cancelColor: 'primary', cancelText: 'Cancel',

			proceed: () => answer.next(true),
			cancel: () => answer.next(false),
		};
		this.dialog.open(ModalComponent, <MatDialogConfig>{ data: data });

		return answer;
	}

	// #endregion

	// #region Form validation

	/**
	 * Form Validation that disallows values that are considered unique for the given property.
	 * @param contentList
	 * @param prop
	 */
	private disallowed(contentList: BehaviorSubject<CmsContent[]>, prop: string) {
		return (control: AbstractControl): { [key: string]: any } => {
			const list = contentList.getValue();
			if (list && list.some((content) => {
				const val = content[prop].toLowerCase();

				if (this.originalContent) {
					// Only match for equal values that are NOT the same as the originalContent value (which is this draft)
					return (val === control.value.toLowerCase()) && (val !== this.originalContent[prop].toLowerCase());
				}
				return (val === control.value.toLowerCase());
			})) {
				return { alreadyExists: true };
			}
		};
	}



	// #endregion

	// #region Methods


	/**
	 * Submits the form and hands it over to the cmsService
	 */
	public submitForm() {
		const content: CmsContent = this.contentForm.getRawValue();
		content.route = content.route.toLowerCase();

		// Helper
		const onSubmit = (obs: Observable<CmsContent>) => {
			const sub = obs.subscribe(
				newContent => {
					sub.unsubscribe();
					if (newContent) {
						this.cmsService.getContentList(true);
						this.hasSaved = true;
						this.router.navigateByUrl(newContent.route);
					}
				},
				error => { sub.unsubscribe(); },
			);
		}

		if (this.originalContent) {
			// use this.inputContent.route instead of the new route, as we want to update
			// the route might've changed in the form data
			onSubmit(this.cmsService.updateContent(this.originalContent.route, content));
			return;
		}
		onSubmit(this.cmsService.createContent(content));
	}


	/**
	 * returns the CmsAccess value of the selected access privileges
	 * @return {CmsAccess} the selected value
	 */
	public getAccessChoice(): CmsAccess {
		return this.accessChoices.find(choice => this.contentForm.get('access').value === choice.value);
	}

	/**
	 * toggles the disabled status of the folder field
	 */
	public setFormDisabledState() {
		if (this.contentForm.get('nav').value) {
			this.contentForm.get('folder').enable();
		} else {
			this.contentForm.get('folder').disable();
		}
	}

	// #endregion
}
