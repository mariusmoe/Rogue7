/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
	id: string;
}

declare var ClassicEditor;
declare var CKEDITOR;

interface CKEditor {
	document: any;
	getData(): string;
	setData(html: string): void;
	destroy(): void;
	listenTo(emitter: object, event: string, callback: any): any;
	isReadOnly: boolean;
}
