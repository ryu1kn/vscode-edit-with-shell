
const Editor = require('../../lib/editor');

describe('Editor', () => {

    it('holds a selected text', () => {
        const vsEditor = fakeEditor({selectedText: 'SELECTED_TEXT'});
        const editor = new Editor(vsEditor);
        expect(editor.selectedText).to.eql('SELECTED_TEXT');
    });

    it('holds a file path', () => {
        const vsEditor = fakeEditor({uriScheme: 'file'});
        const editor = new Editor(vsEditor);
        expect(editor.filePath).to.eql('FILE_PATH');
    });

    it('does not hold a file path if editor content has never been saved', () => {
        const vsEditor = fakeEditor({});
        const editor = new Editor(vsEditor);
        expect(editor.filePath).to.be.null;
    });

    it('replaces selected text with command given text', async () => {
        const vsEditor = fakeEditor({selectedText: 'SELECTED_TEXT'});
        const editor = new Editor(vsEditor);

        await editor.replaceSelectedTextWith('NEW_TEXT');

        expect(vsEditor._editBuilder.replace).to.have.been.calledWith(
            vsEditor.selection,
            'NEW_TEXT'
        );
    });

    function fakeEditor(params) {
        const selectedText = params.selectedText;
        const uriScheme = params.uriScheme;
        return {
            selection: {
                text: selectedText,
                isEmpty: !selectedText
            },
            document: {
                getText: sinon.stub().returns(selectedText),
                uri: {
                    scheme: uriScheme || 'untitled',
                    fsPath: 'FILE_PATH'
                }
            },
            edit: function (callback) {
                callback(this._editBuilder);
                return Promise.resolve(true);
            },
            _editBuilder: {replace: sinon.spy()}
        };
    }

});
