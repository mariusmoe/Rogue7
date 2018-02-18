import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy,
  ViewContainerRef, PLATFORM_ID, Inject } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

import { ModalData } from '@app/models';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ModalComponent } from '@app/modules/base-module/modals/modal.component';

import { CMSService, AuthService, MobileService } from '@app/services';
import { CmsContent, CmsAccess, AccessRoles } from '@app/models';

import { CKEditorComponent } from '../ckeditor-component/ckeditor.component';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-compose-component',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComposeComponent implements OnInit, OnDestroy {
  @ViewChild(CKEditorComponent) editor: CKEditorComponent;

  AccessRoles = AccessRoles;

  public inputContent: CmsContent; // http input

  private ngUnsubscribe = new Subject();
  private hasSaved = false;
  private initialEditorValue: string; // used for canDeactivate

  contentForm: FormGroup;
  accessChoices: CmsAccess[] = [
    { value: AccessRoles.everyone,  verbose: 'Everyone',  icon: 'group' },
    { value: AccessRoles.user,      verbose: 'Users',     icon: 'verified_user' },
    { value: AccessRoles.admin,     verbose: 'Admins',    icon: 'security' }
  ];

  folders: string[] = [];


  static disallowedRoutes(contentList: BehaviorSubject<CmsContent[]>) {
    return (control: AbstractControl): { [key: string]: any} => {
      const list = contentList.getValue();
      if (list && list.some( (content) => content.route === control.value )) {
        return { routeAlreadyTaken: true };
      }
    };
  }


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
      'route': ['', ComposeComponent.disallowedRoutes(cmsService.getContentList())],
      'title': ['', Validators.required],
      'description': ['', Validators.required],
      'access': [AccessRoles.everyone, Validators.required],
      'nav': [true],
      'folder': [''],
    });

    // Create Folder autocomplete list
    this.cmsService.getContentList().pipe(takeUntil(this.ngUnsubscribe)).subscribe( contentList => {
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
    const param = route.snapshot.params['route'];
    if (!param) { return; }
    this.cmsService.requestContent(param).subscribe(data => {
      this.inputContent = data;
      this.contentForm.get('route').setValue(data.route);
      this.contentForm.get('route').disable(); // TODO: fixme.
      this.contentForm.get('title').setValue(data.title);
      this.contentForm.get('description').setValue(data.description);
      this.contentForm.get('access').setValue(data.access);
      this.contentForm.get('nav').setValue(data.nav);
      this.contentForm.get('folder').setValue(data.folder);
      if (!data.nav) { this.contentForm.get('folder').disable(); }
      if (this.editor.loadStatus().getValue()) {
        this.editor.Value = data.content;
        this.initialEditorValue = this.editor.Value;
      }
    }, err => {
      router.navigateByUrl('/admin/compose');
    });
  }

  ngOnInit() {
    if (this.inputContent) {
      this.editor.Value = this.inputContent.content;
    }

    this.editor.loadStatus().pipe(takeUntil(this.ngUnsubscribe)).subscribe( hasLoaded => {
      if (hasLoaded) {
        if (this.inputContent) { this.editor.Value = this.inputContent.content; }
        this.initialEditorValue = this.editor.Value;
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // ---------------------------------------
  // -------------- UTILITIES --------------
  // ---------------------------------------


  canDeactivate() {
    // if we've saved, we're fine deactivating!
    if (this.hasSaved) { return true; }

    // Check if we're changing an existing content entry
    const isDirty = (this.editor.Value !== this.initialEditorValue) || this.contentForm.dirty;

    // if we're not dirty, we can also deactivate
    if (!isDirty) { return true; }

    const answer = new Subject<boolean>();

    const data: ModalData = {
      headerText: 'Unsaved work!',
      bodyText: 'Do you wish to proceed without saving?',
      proceedColor: 'accent',   proceedText: 'Proceed',
      cancelColor: 'primary',   cancelText: 'Cancel',
      includeCancel: true,

      proceed: () => answer.next(true),
      cancel: () => answer.next(false),
    };
    this.dialog.open(ModalComponent, <MatDialogConfig>{ data: data });

    return answer;
  }

  /**
   * Submits the form and hands it over to the cmsService
   */
  submitForm() {
    const content: CmsContent = this.contentForm.getRawValue();
    content.content = this.editor.Value;
    content.route = content.route.toLowerCase();

    if (this.inputContent) {
      // use this.inputContent.route instead of the new route, as we want to update
      // the route might've changed in the form data
      this.onSubmit(this.cmsService.updateContent(this.inputContent.route, content));
      return;
    }
    this.onSubmit(this.cmsService.createContent(content));
  }

  // ---------------------------------------
  // --------------- HELPERS ---------------
  // ---------------------------------------

  /**
   * helper for submitForm()
   */
  private onSubmit(obs: Observable<CmsContent>) {
    const sub = obs.subscribe(
      newContent => {
        sub.unsubscribe();
        if (newContent) {
          this.cmsService.getContentList(true);
          this.hasSaved = true;
          this.router.navigateByUrl(newContent.route);
        }
      },
      error => {
        sub.unsubscribe();
      },
    );
  }

  /**
   * returns the CmsAccess value of the selected access privileges
   * @return {CmsAccess} the selected value
   */
  getAccessChoice(): CmsAccess {
    return this.accessChoices.find(choice => this.contentForm.get('access').value === choice.value);
  }

  /**
   * toggles the disabled status of the folder field
   */
  updateFolderDisableState() {
    if (this.contentForm.get('nav').value) {
      this.contentForm.get('folder').enable();
    } else {
      this.contentForm.get('folder').disable();
    }
  }
}
