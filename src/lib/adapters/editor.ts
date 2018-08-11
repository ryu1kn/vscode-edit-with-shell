import {Position, Range, TextEditor as VsTextEditor} from 'vscode';

export interface LocationFactory {
    createPosition(line: number, character: number): Position;
    createRange(start: Position, end: Position): Range;
}

export default class Editor {
    private _vsEditor: VsTextEditor;
    private _locationFactory: LocationFactory;

    constructor(vsEditor, locationFactory?) {
        this._vsEditor = vsEditor;
        this._locationFactory = locationFactory;
    }

    get selectedText() {
        const editor = this._vsEditor;
        return editor.document.getText(editor.selection);
    }

    get entireText() {
        return this._vsEditor.document.getText();
    }

    get filePath() {
        const uri = this._vsEditor.document.uri;
        return uri.scheme === 'file' ? uri.fsPath : null;
    }

    replaceSelectedTextWith(text) {
        const editor = this._vsEditor;
        return editor.edit(editBuilder => {
            editBuilder.replace(editor.selection, text);
        });
    }

    replaceEntireTextWith(text) {
        const editor = this._vsEditor;
        const document = editor.document;
        const lineCount = document.lineCount;
        const lastLine = document.lineAt(lineCount - 1);
        const entireRange = this._locationFactory.createRange(
            this._locationFactory.createPosition(0, 0),
            lastLine.range.end
        );
        return editor.edit(editBuilder => {
            editBuilder.replace(entireRange, text);
        });
    }

}
