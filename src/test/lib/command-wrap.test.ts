import {contains, mock, mockFunction, mockMethods, mockType, verify, when} from '../helper';
import {Editor, WrapEditor} from '../../lib/adapters/editor';
import {Logger} from '../../lib/logger';
import {ShowErrorMessage} from '../../lib/types/vscode';
import * as vscode from 'vscode';
import CommandWrap from '../../lib/command-wrap';
import {ExtensionCommand} from '../../lib/commands/extension-command';

describe('CommandWrap', () => {
    let logger: Logger;
    let showErrorMessage: ShowErrorMessage;
    let command: ExtensionCommand;
    let commandWrap: CommandWrap;

    const rowGoodEditor = mockType<vscode.TextEditor>({id: 'good'});
    const rowBadEditor = mockType<vscode.TextEditor>({id: 'bad'});

    const goodEditor = mock(Editor);
    const badEditor = mock(Editor);

    const wrapEditor = mockFunction() as WrapEditor;
    when(wrapEditor(rowGoodEditor)).thenReturn(goodEditor);
    when(wrapEditor(rowBadEditor)).thenReturn(badEditor);

    beforeEach(() => {
        logger = mockMethods<Logger>(['error']);
        showErrorMessage = mockFunction() as ShowErrorMessage;

        command = mockMethods<ExtensionCommand>(['execute']);
        when(command.execute(badEditor)).thenThrow(new Error('UNEXPECTED_ERROR'));

        commandWrap = new CommandWrap(command, wrapEditor, showErrorMessage, logger);
    });

    it('invokes wrapped command with wrapped editor', async () => {
        await commandWrap.execute(rowGoodEditor);

        verify(command.execute(goodEditor));
    });

    it('reports an error', async () => {
        await commandWrap.execute(rowBadEditor);

        verify(showErrorMessage(contains('UNEXPECTED\\_ERROR')));
        verify(logger.error(contains('Error: UNEXPECTED_ERROR')));
    });
});
