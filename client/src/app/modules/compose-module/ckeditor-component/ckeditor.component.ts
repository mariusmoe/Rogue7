import {
	Component, OnInit, OnDestroy, ViewChild, ElementRef,
	Input, Output, EventEmitter, ChangeDetectionStrategy, Inject
} from '@angular/core';

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
	@ViewChild('content') editorBox: ElementRef;
	@Output() onChange = new EventEmitter<string>();

	public get isReadOnly() { return (this._editor && this._editor.isReadOnly); }
	public set isReadOnly(value: boolean) { this._editor.isReadOnly = value; }

	public get value(): string { return this._editor.getData(); }
	public set value(value: string) {
		if (!this._editor) {
			this._value = value;
			return;
		}
		this._editor.setData(value);
	}

	public get loadStatus(): BehaviorSubject<boolean> { return this._hasLoaded; }

	private _value: string;
	private _editor: CKEditor;
	private _hasLoaded = new BehaviorSubject<boolean>(false);
	private _settings = {
		image: {
			toolbar: ['imageTextAlternative', '|', 'imageStyleAlignLeft', 'imageStyleFull', 'imageStyleAlignRight'],
			styles: ['imageStyleAlignLeft', 'imageStyleFull', 'imageStyleAlignRight']
		}
	};

	constructor(
		public mobileService: MobileService,
		@Inject(DOCUMENT) private document: Document) { }


	ngOnInit() {
		// Load CKEditor if it already exists
		if (typeof ClassicEditor !== 'undefined') {
			this.loadCKEditor();
			return;
		}
	}

	ngOnDestroy() {
		// User might navigate away before the editor gets to load.
		if (this._editor) {
			this._editor.destroy();
		}
	}


	/**
	 * Loads CKEditor and sets the editor var
	 */
	private loadCKEditor() {
		if (this._editor) { return; }
		ClassicEditor.create(this.editorBox.nativeElement, this._settings)
			.then(editor => {
				this._editor = editor;
				this._editor.listenTo(this._editor.document, 'changesDone', () => {
					this.onChange.emit(this._editor.getData());
				});
				if (this._value) { this._editor.setData(this._value); }
				// notify loaded
				this._hasLoaded.next(true);
			}).catch(err => {
			});
	}
}
