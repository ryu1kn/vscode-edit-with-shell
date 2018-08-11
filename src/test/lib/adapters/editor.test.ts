import {expect, sinon} from '../../helper';

import Editor from '../../../lib/adapters/editor';

describe('Editor', () => {

    it('holds a selected text', () => {
        const vsEditor = fakeEditor({selectedText: 'SELECTED_TEXT'});
        const editor = new Editor(vsEditor);
        expect(editor.selectedText).to.eql('SELECTED_TEXT');
    });

    it('holds the entire text', () => {
        const vsEditor = fakeEditor({});
        const editor = new Editor(vsEditor);
        expect(editor.entireText).to.eql('FOO\n\nBAR');
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

    it('replaces the selected text with given text', async () => {
        const vsEditor = fakeEditor({selectedText: 'SELECTED_TEXT'});
        const editor = new Editor(vsEditor);

        await editor.replaceSelectedTextWith('NEW_TEXT');

        expect(vsEditor._editBuilder.replace).to.have.been.calledWith(
            vsEditor.selection,
            'NEW_TEXT'
        );
    });

    it('replaces the entire text with the command output', async () => {
        const vsEditor = fakeEditor({});
        const locationFactory = {createPosition, createRange};
        const editor = new Editor(vsEditor, locationFactory);

        await editor.replaceEntireTextWith('NEW_TEXT');

        expect(vsEditor._editBuilder.replace).to.have.been.calledWith(
            createRange(createPosition(0, 0), createPosition(2, 24)),
            'NEW_TEXT'
        );
    });

    function fakeEditor(params) {
        const selectedText = params.selectedText;
        const entireText = `FOO\n${selectedText || ''}\nBAR`;
        const uriScheme = params.uriScheme;
        return {
            selection: {
                text: selectedText,
                isEmpty: !selectedText
            },
            document: {
                getText: sinon.stub().returns(selectedText || entireText),
                uri: {
                    scheme: uriScheme || 'untitled',
                    fsPath: 'FILE_PATH'
                },
                lineCount: entireText.split('\n').length,
                lineAt: lineIndex => ({
                    range: createRange(createPosition(lineIndex, 0), createPosition(lineIndex, 24))
                })
            },
            edit: function (callback) {
                callback(this._editBuilder);
                return Promise.resolve(true);
            },
            _editBuilder: {replace: sinon.spy()}
        };
    }

    function createPosition(line, column) {
        return {line, column};
    }

    function createRange(position1, position2) {
        return {
            start: position1,
            end: position2
        };
    }

});
