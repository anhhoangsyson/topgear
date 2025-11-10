// Type definitions for react-quill-new
// Custom type definitions for Quill editor methods we use

export interface QuillEditor {
  getSelection: () => { index: number; length: number } | null;
  insertEmbed: (index: number, type: string, value: string) => void;
  root: HTMLElement;
}

export interface ReactQuillRef {
  getEditor: () => QuillEditor;
}

