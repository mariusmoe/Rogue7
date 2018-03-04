import {
	Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, Inject, ChangeDetectionStrategy
} from '@angular/core';

import { FormControl } from '@angular/forms';

import { DOCUMENT } from '@angular/platform-browser';

import { CmsContent } from '@app/models';
import { MobileService } from '@app/services';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic/build/ckeditor';

@Component({
	selector: 'ck-editor',
	templateUrl: './ckeditor.component.html',
	styleUrls: ['./ckeditor.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CKEditorComponent implements OnInit, OnDestroy {
	// editor
	@ViewChild('content') editorBox: ElementRef;
	private _editor: CKEditor;
	private _control: FormControl;

	@Input() public set control(value: FormControl) {
		if (this._control) { return; }
		this._control = value;
	}

	private readonly _settings = {
		image: {
			toolbar: ['imageTextAlternative', '|', 'imageStyleAlignLeft', 'imageStyleFull', 'imageStyleAlignRight'],
			styles: ['imageStyleAlignLeft', 'imageStyleFull', 'imageStyleAlignRight']
		}
	};

	constructor(
		public mobileService: MobileService,
		@Inject(DOCUMENT) private document: Document) { }


	ngOnInit() {
		if (typeof ClassicEditor === 'undefined') { return; }
		if (this._editor) { return; } // if editor ALREADY exist.
		if (!this._control) { return; } // if control DOESNT exist.

		// Load CKEditor
		ClassicEditor.create(this.editorBox.nativeElement, this._settings).then(editor => {
			this._editor = editor;

			// Disabled / ReadOnly flags
			this._editor.isReadOnly = this._control.disabled;

			this._control.registerOnDisabledChange((disabled) => {
				this._editor.isReadOnly = disabled;
			});

			// Set Value
			this._editor.setData(this._control.value);

			this._control.valueChanges.subscribe((value: string) => {
				if (this._editor.getData() === value) { return; }
				// Set editor value
				this._editor.setData(value);
			});

			// Create editor event listener
			this._editor.listenTo(this._editor.document, 'changesDone', () => {
				if (this._editor.getData() === this._control.value) { return; }
				// Set control value
				this._control.setValue(this._editor.getData());
				// Mark as dirty
				if (!this._control.dirty) { this._control.markAsDirty(); }
			});
		}).catch(err => {

		});
	}

	ngOnDestroy() {
		// User might navigate away before the editor gets to load.
		if (this._editor) { this._editor.destroy(); }
	}

}
