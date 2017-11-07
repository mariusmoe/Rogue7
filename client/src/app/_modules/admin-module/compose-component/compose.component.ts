import { Component, OnDestroy, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CMSService } from '../../../_services/cms.service';
import { AuthService } from '../../../_services/auth.service';

import { CmsContent, CmsAccess } from '../../../_models/cms';
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
export class ComposeComponent implements OnDestroy {
  private ngUnsubscribe = new Subject();
  contentForm: FormGroup;
  accessChoices: CmsAccess[] = [
    { value: 'everyone',  verbose: 'Everyone',  icon: 'group' },
    { value: 'user',      verbose: 'Users',     icon: 'verified_user' }
  ];
  inputContent: CmsContent;
  @ViewChild(CKEditorComponent) editor: CKEditorComponent;

  // folders: Set<string> = new Set();
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
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public cmsService: CMSService,
    public authService: AuthService) {

    // Form
    this.contentForm = fb.group({
      'route': ['', ComposeComponent.disallowedRoutes(cmsService.getContentList())],
      'title': ['', Validators.required],
      'folder': [''],
      'access': ['everyone', Validators.required],
    });

    // Admin as access choice
    const user = this.authService.getUser().getValue();
    if (user && user.role === 'admin') {
      this.accessChoices.push({ value: 'admin', verbose: 'Admins', icon: 'security' });
    }

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
      this.contentForm.get('folder').setValue(data.folder);
      this.contentForm.get('access').setValue(data.access);
      if (this.editor) { this.editor.setValue(data.content); }
    }, err => {
      router.navigateByUrl('/admin/compose');
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  /**
   * returns the CmsAccess value of the selected access privileges
   * @return {CmsAccess} the selected value
   */
  getAccessChoice(): CmsAccess {
    return this.accessChoices.find(choice => this.contentForm.get('access').value === choice.value);
  }
  /**
   * Submits the form and hands it over to the cmsService
   */
  submitForm() {
    const content: CmsContent = this.contentForm.getRawValue();
    content.content = this.editor.getValue();
    content.route = content.route.toLowerCase();

    if (this.inputContent) {
      // use this.inputContent.route instead of the new route, as we want to update
      // the route might've changed in the form data
      this.onSubmit(this.cmsService.updateContent(this.inputContent.route, content));
      return;
    }
    this.onSubmit(this.cmsService.createContent(content));
  }

  /**
   * Helper function
   */
  private onSubmit(obs: Observable<CmsContent>) {
    const sub = obs.subscribe(
      newContent => {
        sub.unsubscribe();
        if (newContent) {
          this.cmsService.getContentList(true);
          this.router.navigate([newContent.route]);
        }
      },
      error => {
        sub.unsubscribe();
      },
    );
  }
}
