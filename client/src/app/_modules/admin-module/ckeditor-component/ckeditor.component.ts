import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { CmsContent } from '../../../_models/cms';
// import { DOCUMENT } from '@angular/platform-browser';
import * as CK5 from '@ckeditor/ckeditor5-build-classic/build/ckeditor';

@Component({
  selector: 'app-ckeditor',
  templateUrl: './ckeditor.component.html',
  styleUrls: ['./ckeditor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class CKEditorComponent implements OnInit, OnDestroy {
  @ViewChild('content') editorBox: ElementRef;
  @Input() value: string;
  @Output() onChange = new EventEmitter<string>();
  editor: CKEditor;

  settings = {
    image: {
      toolbar: [ 'imageTextAlternative', '|', 'imageStyleAlignLeft', 'imageStyleFull', 'imageStyleAlignRight' ],
      styles: [ 'imageStyleAlignLeft', 'imageStyleFull', 'imageStyleAlignRight' ]
    }
  };

  constructor() {
   }

  ngOnInit() {
    this.loadCKEditor();

    // Load CKEditor from CDN
    // const script = this.document.createElement('script');
    // script.type = 'text/javascript';
    // script.async = 'async';
    // script.src = 'http://cdn.ckeditor.com/ckeditor5/0.11.0/classic/ckeditor.js';
    // script.onload = () => { this.loadCKEditor(); };
    // this.editorBox.nativeElement.parentNode.insertBefore(script, this.editorBox.nativeElement);
  }


  ngOnDestroy() {
    // User might navigate away before the editor gets to load.
    if (this.editor) {
      this.editor.destroy();
    }
  }

  /**
   * Loads CKEditor and sets the editor var
   */
  loadCKEditor() {
    CK5.create(this.editorBox.nativeElement, this.settings)
    .then( editor => {
      this.editor = editor;
      this.editor.listenTo(this.editor.document, 'changesDone', () => {
        this.onChange.emit(this.editor.getData());
      });
      if (this.value) { this.editor.setData(this.value); }
    }).catch( err => {
    });
  }


  /**
   * Returns the HTML value of the editor
   * @return {string} the HTML representation of the content
   */
  public getValue(): string {
    return this.editor.getData();
  }

  /**
   * Sets the HTML value of the editor
   * @param  {string} value the HTML representation of the content
   */
  public setValue(value: string) {
    if (!this.editor) {
      this.value = value;
      return;
    }
    this.editor.setData(value);
  }
}
