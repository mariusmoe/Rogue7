import {
	Component, Input, OnInit, AfterViewInit, OnDestroy, DoCheck, ChangeDetectionStrategy, ChangeDetectorRef,
	ComponentFactoryResolver, InjectionToken, Injector, ComponentFactory, ViewChild, ElementRef, ComponentRef
} from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';

import { CMSService, AuthService } from '@app/services';
import { ModalData, CmsContent, AccessRoles } from '@app/models';

import { ModalComponent } from '@app/modules/shared-module/modals/modal.component';

import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { takeUntil } from 'rxjs/operators';

import { DynamicLinkComponent } from '../content-controllers/dynamic.link.component';


@Component({
	selector: 'content-component',
	templateUrl: './content.component.html',
	styleUrls: ['./content.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent implements OnInit, AfterViewInit, OnDestroy, DoCheck {
	@Input() public set contentInput(value: CmsContent) { this.contentSubject.next(value); }
	@Input() public previewMode = false;

	// #region Public fields

	public AccessRoles = AccessRoles;
	public contentSubject = new BehaviorSubject<CmsContent>(null);

	// #endregion

	// #region Private fields

	private _ngUnsub = new Subject();
	@ViewChild('contentHost') private _contentHost: ElementRef;
	private _ngLinkFactory: ComponentFactory<DynamicLinkComponent>;
	private _embeddedComponents: ComponentRef<DynamicLinkComponent>[] = [];

	// #endregion

	// #region Constructor

	constructor(
		private resolver: ComponentFactoryResolver,
		private injector: Injector,
		private dialog: MatDialog,
		private router: Router,
		private route: ActivatedRoute,
		public authService: AuthService,
		public cmsService: CMSService) {

		this._ngLinkFactory = resolver.resolveComponentFactory(DynamicLinkComponent);

	}

	// #endregion

	// #region Interface implementations

	ngOnInit() {
		// If the contentSubject already has a value, then that's great!
		if (!this.contentSubject.getValue()) {
			this.contentSubject.next(this.route.snapshot.data['CmsContent']);
		}

		this.router.events.pipe(takeUntil(this._ngUnsub)).subscribe(e => {
			if (e instanceof NavigationEnd) {
				this.contentSubject.next(this.route.snapshot.data['CmsContent']);
			}
		});
	}

	ngAfterViewInit() {
		this.contentSubject.pipe(takeUntil(this._ngUnsub)).subscribe(content => {
			this.build(content);
			// Detect changes manually for each component.
			this._embeddedComponents.forEach(comp => comp.changeDetectorRef.detectChanges());
		});
	}

	ngOnDestroy() {
		this._ngUnsub.next();
		this._ngUnsub.complete();
		// Clean components
		this.cleanEmbeddedComponents();
	}

	ngDoCheck() {
		this._embeddedComponents.forEach(comp => comp.changeDetectorRef.detectChanges());
	}

	// #endregion

	// #region Private methods

	/**
	 * Inserts the content into DOM
	 * @param cmsContent
	 */
	private build(cmsContent: CmsContent) {
		// null ref checks
		if (!this._contentHost || !this._contentHost.nativeElement || !cmsContent || !cmsContent.content) {
			return;
		}
		// Clean components before rebuilding.
		this.cleanEmbeddedComponents();
		// Prepare content for injection
		const e = (<HTMLElement>this._contentHost.nativeElement);
		const nglinksel = this._ngLinkFactory.selector;
		e.innerHTML = cmsContent.content.replace(/<a /g, `<${nglinksel} `).replace(/<\/a>/g, `</${nglinksel}>`);

		// query for elements we need to adjust
		const ngLinks = e.querySelectorAll(this._ngLinkFactory.selector);
		for (let i = 0; i < ngLinks.length; i++) {
			const link = ngLinks.item(i);
			const savedTextContent = link.textContent; // save text content before we modify the element
			// convert NodeList into an array, since Angular dosen't like having a NodeList passed for projectableNodes
			const comp = this._ngLinkFactory.create(this.injector, [Array.prototype.slice.call(link.childNodes)], link);
			// apply inputs into the dynamic component
			// only static ones work here since this is the only time they're set
			for (const attr of (link as any).attributes) {
				comp.instance[attr.nodeName] = attr.nodeValue;
			}
			comp.instance.link = link.getAttribute('href');
			comp.instance.text = savedTextContent;

			this._embeddedComponents.push(comp);
		}
	}

	private cleanEmbeddedComponents() {
		// destroycomponents to avoid be memory leaks
		this._embeddedComponents.forEach(comp => comp.destroy());
		this._embeddedComponents.length = 0;
	}

	// #endregion

	// #region Public methods

	/**
	 * Navigate the user to the editor page.
	 */
	public navigateToEditPage() {
		this.router.navigateByUrl('/compose/' + this.contentSubject.getValue().route);
	}

	/**
	 * Opens a modal asking the user to verify intent to delete the page they're viewing
	 */
	public deletePage() {
		const content = this.contentSubject.getValue();
		const data: ModalData = {
			headerText: `Delete ${content.title}`,
			bodyText: 'Do you wish to proceed?',
			proceedText: 'Delete', proceedColor: 'warn',
			cancelText: 'Cancel', cancelColor: 'accent',
			cancel: () => { },
			proceed: () => {
				const sub = this.cmsService.deleteContent(content.route).subscribe(
					() => {
						sub.unsubscribe();
						this.cmsService.getContentList(true);
						this.router.navigateByUrl('/');
					}
				);
			},
		};
		this.dialog.open(ModalComponent, <MatDialogConfig>{ data: data });
	}

	// #endregion
}
