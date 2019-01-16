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

    get selectedTexts(): string[] {
        const editor = this.vsEditor;
        return editor.selections
            .map(selection => editor.document.getText(selection));
    }

    get entireText(): string {
        return this.vsEditor.document.getText();
    }

    get isTextSelected(): boolean {
        return this.selectedTexts.length > 1 || this.selectedTexts[0] !== '';
    }

    get filePath(): string | undefined {
        const uri = this.vsEditor.document.uri;
        return uri.scheme === 'file' ? uri.fsPath : undefined;
    }

    replaceSelectedTextsWith(texts: string[]) {
        const editor = this.vsEditor;
        return editor.edit(editBuilder => {
            editor.selections.forEach((selection, index) => {
                editBuilder.replace(selection, texts[index]);
            });
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
