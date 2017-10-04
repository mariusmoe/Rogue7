import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, ChangeDetectionStrategy } from '@angular/core'; // Inject

import { CmsContent } from '../../../_models/cms';
// import { DOCUMENT } from '@angular/platform-browser';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic/build/ckeditor';

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
  editor: CKEditor;

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
    this.editor.destroy();
  }

  /**
   * Loads CKEditor and sets the editor var
   */
  loadCKEditor() {
    ClassicEditor.create(this.editorBox.nativeElement)
    .then( editor => {
      this.editor = editor;
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
