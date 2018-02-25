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
	selector: 'ckeditor',
	templateUrl: './ckeditor.component.html',
	styleUrls: ['./ckeditor.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CKEditorComponent implements OnInit, OnDestroy {
	@ViewChild('content') editorBox: ElementRef;
	@Output() onChange = new EventEmitter<string>();

	private _value: string;

	private editor: CKEditor;
	private hasLoaded = new BehaviorSubject<boolean>(false);

	settings = {
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
			.then(editor => {
				this.editor = editor;
				this.editor.listenTo(this.editor.document, 'changesDone', () => {
					this.onChange.emit(this.editor.getData());
				});
				if (this._value) { this.editor.setData(this._value); }
				// notify loaded
				this.hasLoaded.next(true);
			}).catch(err => {
			});
	}


	/**
	 * Returns the HTML value of the editor
	 * @return {string} the HTML representation of the content
	 */
	get Value(): string {
		return this.editor.getData();
	}

	/**
	 * Sets the HTML value of the editor
	 * @param  {string} value the HTML representation of the content
	 */
	set Value(value: string) {
		if (!this.editor) {
			this._value = value;
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
