import { Component, OnInit, OnDestroy, ViewChild, ElementRef,
  Input, Output, EventEmitter, ChangeDetectionStrategy, Inject } from '@angular/core';

import { CmsContent } from '@app/models';
import { DOCUMENT } from '@angular/platform-browser';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic/build/ckeditor';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-ckeditor',
  templateUrl: './ckeditor.component.html',
  styleUrls: ['./ckeditor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CKEditorComponent implements OnInit, OnDestroy {
  @ViewChild('content') editorBox: ElementRef;
  @Input() value: string;
  @Output() onChange = new EventEmitter<string>();

  private editor: CKEditor;
  private hasLoaded = new BehaviorSubject<boolean>(false);

  settings = {
    image: {
      toolbar: [ 'imageTextAlternative', '|', 'imageStyleAlignLeft', 'imageStyleFull', 'imageStyleAlignRight' ],
      styles: [ 'imageStyleAlignLeft', 'imageStyleFull', 'imageStyleAlignRight' ]
    }
  };

  constructor(@Inject(DOCUMENT) private document: Document) {
   }

  ngOnInit() {
    // this.loadCKEditor();
    // Load CKEditor if it already exists
    if (typeof ClassicEditor !== 'undefined') {
      this.loadCKEditor();
      return;
    }
    // Load from CDN
    const script = this.document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://cdn.ckeditor.com/ckeditor5/1.0.0-alpha.2/classic/ckeditor.js';
    script.onload = () => { this.loadCKEditor(); };
    this.document.body.appendChild(script);
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
  private loadCKEditor() {
    if (this.editor) { return; }
    ClassicEditor.create(this.editorBox.nativeElement, this.settings)
    .then( editor => {
      this.editor = editor;
      this.editor.listenTo(this.editor.document, 'changesDone', () => {
        this.onChange.emit(this.editor.getData());
      });
      if (this.value) { this.editor.setData(this.value); }
      // notify loaded
      this.hasLoaded.next(true);
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

  /**
   * Get wether the editor has loaded and any value has been set.
   * @return {BehaviorSubject<boolean>} [description]
   */
  public loadStatus(): BehaviorSubject<boolean> {
    return this.hasLoaded;
  }
}
