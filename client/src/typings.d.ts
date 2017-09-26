/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare var ClassicEditor;
declare var CKEDITOR;

interface CKEditor {
  getData(): string;
  setData(html: string): void;
  destroy(): void;
}
