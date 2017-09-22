import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CMSService } from '../../../_services/cms.service';
import { AuthService } from '../../../_services/auth.service';

import { CmsContent } from '../../../_models/cms';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic/build/ckeditor';


@Component({
  selector: 'app-compose-component',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.scss'],
})
export class ComposeComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  contentForm: FormGroup;
  accessChoices: string[] = ['everyone', 'user'];
  accessVerbose = { 'everyone': 'Everyone', 'admin': 'Admins', 'user': 'Users' };
  inputContent: CmsContent;
  @ViewChild('content') editorBox: ElementRef;
  editor: any;


  disallowedRoutes(contentList: BehaviorSubject<CmsContent[]>) {
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
      'route': ['', this.disallowedRoutes(cmsService.getContentList())],
      'title': ['', Validators.required],
      'access': ['everyone', Validators.required],
      // 'content': ['', Validators.required]
    });
    const param = route.snapshot.params['route'];
    if (param) {
      this.cmsService.requestContent(param).subscribe(
        data => {
          this.inputContent = data;
          this.contentForm.controls['route'].disable();
          this.contentForm.controls['route'].setValue(data.route);
          this.contentForm.controls['title'].setValue(data.title);
          this.contentForm.controls['access'].setValue(data.access);
          // this.contentForm.controls['content'].setValue(data.content);
          if (this.editor) { this.editor.setData(data.content); }
        },
        err => {
          router.navigateByUrl('/admin/compose');
        },
      );
    }
   }

  ngOnInit() {
    this.authService.getUser().takeUntil(this.ngUnsubscribe).subscribe( user => {
      // sub.unsubscribe();
      if (user && user.role === 'admin') {
        this.accessChoices.push('admin');
        return;
      }
    });
    // console.log(ClassicEditor);
    ClassicEditor.create(this.editorBox.nativeElement)
    .then( editor => {
      this.editor = editor;
      // console.log(editor);
      if (this.inputContent) { this.editor.setData(this.inputContent.content); }
    }).catch( err => {
      // console.log(err);
    });
  }


  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.editor.destroy();
  }

  submitForm() {
    const content: CmsContent = this.contentForm.value;
    content.content = this.editor.getData();

    if (this.inputContent) {
      content.route = this.inputContent.route;
      this.onSubmit(this.cmsService.updateContent(content.route, content), content.route);
      return;
    }
    content.route = content.route.toLowerCase();
    this.onSubmit(this.cmsService.createContent(content), content.route);
  }

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
