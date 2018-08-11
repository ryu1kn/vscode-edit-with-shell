import {expect, mockMethods, mockType, sinon, verify} from '../../helper';

import Editor from '../../../lib/adapters/editor';
import * as vscode from 'vscode';
import {Position, Range} from 'vscode';

describe('Editor', () => {

    const locationFactory = {createPosition, createRange};

    it('holds a selected text', () => {
        const vsEditor = fakeEditor({selectedText: 'SELECTED_TEXT'});
        const editor = new Editor(vsEditor, locationFactory);
        expect(editor.selectedText).to.eql('SELECTED_TEXT');
    });

    it('holds the entire text', () => {
        const vsEditor = fakeEditor({});
        const editor = new Editor(vsEditor, locationFactory);
        expect(editor.entireText).to.eql('FOO\n\nBAR');
    });

    it('holds a file path', () => {
        const vsEditor = fakeEditor({uriScheme: 'file'});
        const editor = new Editor(vsEditor, locationFactory);
        expect(editor.filePath).to.eql('FILE_PATH');
    });

    it('does not hold a file path if editor content has never been saved', () => {
        const vsEditor = fakeEditor({});
        const editor = new Editor(vsEditor, locationFactory);
        expect(editor.filePath).to.be.undefined;
    });

    it('replaces the selected text with given text', async () => {
        const editBuilder = mockMethods<vscode.TextEditorEdit>(['replace']);
        const vsEditor = fakeEditor({selectedText: 'SELECTED_TEXT', editBuilder});
        const editor = new Editor(vsEditor, locationFactory);

        await editor.replaceSelectedTextWith('NEW_TEXT');

        verify(editBuilder.replace(vsEditor.selection, 'NEW_TEXT'));
    });

    it('replaces the entire text with the command output', async () => {
        const editBuilder = mockMethods<vscode.TextEditorEdit>(['replace']);
        const vsEditor = fakeEditor({editBuilder});
        const locationFactory = {createPosition, createRange};
        const editor = new Editor(vsEditor, locationFactory);

        await editor.replaceEntireTextWith('NEW_TEXT');

        verify(editBuilder.replace(createRange(createPosition(0, 0), createPosition(2, 24)), 'NEW_TEXT'));
    });

    function fakeEditor(params: any) {
        const selectedText = params.selectedText;
        const entireText = `FOO\n${selectedText || ''}\nBAR`;
        const uriScheme = params.uriScheme;
        return mockType<vscode.TextEditor>({
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
                lineAt: (lineIndex: number) => ({
                    range: createRange(createPosition(lineIndex, 0), createPosition(lineIndex, 24))
                })
            },
            edit: function (callback: any) {
                callback(params.editBuilder || {replace: () => {}});
                return Promise.resolve(true);
            }
        });
    }

    function createPosition(line: number, column: number) {
        return mockType<Position>({line, column});
    }

    function createRange(position1: Position, position2: Position) {
        return mockType<Range>({
            start: position1,
            end: position2
        });
    }

});
