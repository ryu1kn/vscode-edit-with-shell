
class Editor {

    constructor(vsEditor) {
        this._vsEditor = vsEditor;
    }

    get selectedText() {
        const editor = this._vsEditor;
        return editor.document.getText(editor.selection);
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

}

module.exports = Editor;
