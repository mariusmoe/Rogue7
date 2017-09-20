import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { CmsContent } from '../../../_models/cms';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic/build/ckeditor';


@Component({
  selector: 'app-ckeditor-component',
  templateUrl: './ckeditor.component.html',
  styleUrls: ['./ckeditor.component.scss'],
})
export class CKEditorComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @ViewChild('content') editorBox: ElementRef;
  editor: any;


  constructor() {
  }

  ngOnInit() {
    ClassicEditor.create(this.editorBox.nativeElement)
    .then( editor => {
      this.editor = editor;
      this.editor.setData('');
    }).catch( err => {
      // console.log(err);
    });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.editor.destroy();
  }

  getData(): string {
    return this.editor.getData();
  }

}
