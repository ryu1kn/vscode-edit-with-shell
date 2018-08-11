import {Position, Range, TextEditor as VsTextEditor} from 'vscode';

export type WrapEditor = (editor: VsTextEditor, lf?: LocationFactory) => Editor;

export interface LocationFactory {
    createPosition(line: number, character: number): Position;
    createRange(start: Position, end: Position): Range;
}

export default class Editor {
    private readonly vsEditor: VsTextEditor;
    private readonly locationFactory: LocationFactory;

    constructor(vsEditor: VsTextEditor, locationFactory: LocationFactory) {
        this.vsEditor = vsEditor;
        this.locationFactory = locationFactory;
    }

    get selectedText() {
        const editor = this.vsEditor;
        return editor.document.getText(editor.selection);
    }

    get entireText() {
        return this.vsEditor.document.getText();
    }

    get filePath(): string | undefined {
        const uri = this.vsEditor.document.uri;
        return uri.scheme === 'file' ? uri.fsPath : undefined;
    }

    replaceSelectedTextWith(text: string) {
        const editor = this.vsEditor;
        return editor.edit(editBuilder => {
            editBuilder.replace(editor.selection, text);
        });
    }

    replaceEntireTextWith(text: string) {
        const editor = this.vsEditor;
        const document = editor.document;
        const lineCount = document.lineCount;
        const lastLine = document.lineAt(lineCount - 1);
        const entireRange = this.locationFactory.createRange(
            this.locationFactory.createPosition(0, 0),
            lastLine.range.end
        );
        return editor.edit(editBuilder => {
            editBuilder.replace(entireRange, text);
        });
    }

}
