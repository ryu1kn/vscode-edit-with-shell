import * as assert from 'assert';
import {mockMethods, mockType, verify} from '../../helper';

import {Editor} from '../../../lib/adapters/editor';
import * as vscode from 'vscode';
import {Position, Range} from 'vscode';

describe('Editor', () => {

    const locationFactory = {createPosition, createRange};

    it('holds a selected text', () => {
        const vsEditor = fakeEditor({selectedTexts: ['SELECTED_TEXT']});
        const editor = new Editor(vsEditor, locationFactory);
        assert.deepEqual(editor.selectedTexts, ['SELECTED_TEXT']);
    });

    it('holds the entire text', () => {
        const vsEditor = fakeEditor({});
        const editor = new Editor(vsEditor, locationFactory);
        assert.deepEqual(editor.entireText, 'FOO\n\nBAR');
    });

    it('holds a file path', () => {
        const vsEditor = fakeEditor({uriScheme: 'file'});
        const editor = new Editor(vsEditor, locationFactory);
        assert.deepEqual(editor.filePath, 'FILE_PATH');
    });

    it('does not hold a file path if editor content has never been saved', () => {
        const vsEditor = fakeEditor({});
        const editor = new Editor(vsEditor, locationFactory);
        assert.equal(typeof editor.filePath, 'undefined');
    });

    it('replaces the selected text with given text', async () => {
        const editBuilder = mockMethods<vscode.TextEditorEdit>(['replace']);
        const vsEditor = fakeEditor({selectedTexts: ['SELECTED_TEXT'], editBuilder});
        const editor = new Editor(vsEditor, locationFactory);

        await editor.replaceSelectedTextsWith(['NEW_TEXT']);

        verify(editBuilder.replace(vsEditor.selections[0], 'NEW_TEXT'));
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
        const selectedTexts = params.selectedTexts || [];
        const entireText = `FOO\n${selectedTexts[0] || ''}\nBAR`;
        const uriScheme = params.uriScheme;
        return mockType<vscode.TextEditor>({
            selections: selectedTexts.map((text: string) => ({
                text,
                isEmpty: !text
            })),
            document: {
                getText: () => selectedTexts[0] || entireText,
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
