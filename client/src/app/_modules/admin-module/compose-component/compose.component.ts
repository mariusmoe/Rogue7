import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CMSService } from '../../../_services/cms.service';
import { AuthService } from '../../../_services/auth.service';

import { CmsContent } from '../../../_models/cms';
import { CKEditorComponent } from '../ckeditor-component/ckeditor.component';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'app-compose-component',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class ComposeComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  contentForm: FormGroup;
  accessChoices: string[] = ['everyone', 'user'];
  accessVerbose = { 'everyone': 'Everyone', 'admin': 'Admins', 'user': 'Users' };
  inputContent: CmsContent;
  @ViewChild(CKEditorComponent) editor: CKEditorComponent;


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

    this.contentForm = fb.group({
      'route': ['', ComposeComponent.disallowedRoutes(cmsService.getContentList())],
      'title': ['', Validators.required],
      'access': ['everyone', Validators.required],
    });
    const param = route.snapshot.params['route'];
    if (param) {
      this.cmsService.requestContent(param).subscribe(
        data => {
          this.inputContent = data;
          this.contentForm.get('route').setValue(data.route);
          this.contentForm.get('route').disable();
          this.contentForm.get('title').setValue(data.title);
          this.contentForm.get('access').setValue(data.access);
          if (this.editor) { this.editor.setValue(data.content); }
        },
        err => {
          router.navigateByUrl('/admin/compose');
        },
      );
    }
   }

  ngOnInit() {
    this.authService.getUser().takeUntil(this.ngUnsubscribe).subscribe( user => {
      if (user && user.role === 'admin') {
        this.accessChoices.push('admin');
        return;
      }
    });
  }


  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Submits the form and hands it over to the cmsService
   */
  submitForm() {
    const content: CmsContent = this.contentForm.getRawValue();
    content.content = this.editor.getValue();
    content.route = content.route.toLowerCase();

    if (this.inputContent) {
      this.onSubmit(this.cmsService.updateContent(content.route, content), content.route);
      return;
    }
    this.onSubmit(this.cmsService.createContent(content), content.route);
  }

  /**
   * Helper function
   */
  private onSubmit(obs: Observable<CmsContent>, redirect: string) {
    const sub = obs.subscribe(
      newContent => {
        sub.unsubscribe();
        if (newContent) {
          this.cmsService.getContentList(true);
          this.router.navigate([redirect]);
        }
      },
      error => {
        sub.unsubscribe();
      },
    );
  }
}
