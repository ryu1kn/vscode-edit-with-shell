import RunCommand from '../../../lib/commands/run';
import Workspace from '../../../lib/adapters/workspace';
import * as vscode from 'vscode';
import Editor from '../../../lib/adapters/editor';
import ShellCommandService from '../../../lib/shell-command-service';
import HistoryStore from '../../../lib/history-store';
import {Logger} from '../../../lib/logger';
import {any, contains, mock, mockFunction, mockMethods, mockType, verify, when} from '../../helper';

describe('RunCommand', () => {

    const rawEditor = mockType<vscode.TextEditor>();

    it('runs command with editor contents and add commands to the history', async () => {
        const historyStore = mock(HistoryStore);
        const shellCommandService = mock(ShellCommandService);
        when(shellCommandService.runCommand({
            command: 'COMMAND_STRING',
            input: 'SELECTED_TEXT',
            filePath: 'FILE_NAME'
        })).thenResolve('COMMAND_OUTPUT');
        const editor = mockMethods<Editor>(['replaceSelectedTextWith'], {
            selectedText: 'SELECTED_TEXT',
            filePath: 'FILE_NAME'
        });
        const wrapEditor = mockFunction();
        when(wrapEditor(rawEditor)).thenReturn(editor);
        const workspaceAdapter = mockType<Workspace>({
            getConfig: (key: string) => key === 'editWithShell.processEntireTextIfNoneSelected' && false
        });
        const command = new RunCommand({
            commandReader: {read: () => Promise.resolve('COMMAND_STRING')},
            historyStore,
            shellCommandService,
            wrapEditor,
            workspaceAdapter
        });

        await command.execute(rawEditor);

        verify(editor.replaceSelectedTextWith('COMMAND_OUTPUT'));
        verify(historyStore.add('COMMAND_STRING'));
    });

    it('processes the entire text', async () => {
        const historyStore = mockType<HistoryStore>({add: () => {}});
        const shellCommandService = mock(ShellCommandService);
        when(shellCommandService.runCommand({
            command: 'COMMAND_STRING',
            input: 'ENTIRE_TEXT',
            filePath: 'FILE_NAME'
        })).thenResolve('COMMAND_OUTPUT');
        const wrapEditor = mockFunction();
        const editor = mockMethods<Editor>(['replaceEntireTextWith'], {
            entireText: 'ENTIRE_TEXT',
            filePath: 'FILE_NAME'
        });
        when(wrapEditor(rawEditor)).thenReturn(editor);
        const workspaceAdapter = mockType<Workspace>({
            getConfig: (key: string) => key === 'editWithShell.processEntireTextIfNoneSelected'
        });
        const command = new RunCommand({
            commandReader: {read: () => Promise.resolve('COMMAND_STRING')},
            historyStore,
            shellCommandService,
            wrapEditor,
            workspaceAdapter,
            logger: console
        });

        await command.execute(rawEditor);

        verify(editor.replaceEntireTextWith('COMMAND_OUTPUT'));
    });

    it('does not try to run a command if one is not given', async () => {
        const historyStore = mock(HistoryStore);
        const shellCommandService = mock(ShellCommandService);
        const editor = mock(Editor);
        const wrapEditor = mockFunction();
        when(wrapEditor(rawEditor)).thenReturn(editor);
        const command = new RunCommand({
            commandReader: {read: () => Promise.resolve()},
            historyStore,
            shellCommandService,
            wrapEditor
        });

        await command.execute(rawEditor);

        verify(editor.replaceSelectedTextWith(any()), {times: 0});
        verify(shellCommandService.runCommand(any()), {times: 0});
        verify(historyStore.add(any()), {times: 0});
    });

    it('reports an error', async () => {
        const logger = mockMethods<Logger>(['error']);
        const showErrorMessage = mockFunction();
        const wrapEditor = mockFunction();
        when(wrapEditor(rawEditor)).thenReturn(mock(Editor));

        const command = new RunCommand({
            commandReader: {
                read: () => Promise.reject(new Error('UNEXPECTED_ERROR'))
            },
            logger,
            showErrorMessage,
            wrapEditor
        });

        await command.execute(rawEditor);

        verify(showErrorMessage(contains('UNEXPECTED\\_ERROR')));
        verify(logger.error(contains('Error: UNEXPECTED_ERROR')));
    });

});
