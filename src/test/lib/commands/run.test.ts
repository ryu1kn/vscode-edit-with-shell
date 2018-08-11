import RunCommand from '../../../lib/commands/run';
import Workspace from '../../../lib/adapters/workspace';
import * as vscode from 'vscode';
import Editor, {WrapEditor} from '../../../lib/adapters/editor';
import ShellCommandService from '../../../lib/shell-command-service';
import HistoryStore from '../../../lib/history-store';
import {Logger} from '../../../lib/logger';
import {any, contains, mock, mockFunction, mockMethods, mockType, verify, when} from '../../helper';
import {ShowErrorMessage} from '../../../lib/types/vscode';
import CommandReader from '../../../lib/command-reader';

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
        const wrapEditor = mockFunction() as WrapEditor;
        when(wrapEditor(rawEditor)).thenReturn(editor);
        const workspaceAdapter = mockType<Workspace>({
            getConfig: (key: string) => key === 'editWithShell.processEntireTextIfNoneSelected' && false
        });
        const command = new RunCommand(
            shellCommandService,
            mockType<CommandReader>({read: () => Promise.resolve('COMMAND_STRING')}),
            historyStore,
            wrapEditor,
            workspaceAdapter,
            mockType<ShowErrorMessage>(),
            mockType<Logger>()
        );

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
        const wrapEditor = mockFunction() as WrapEditor;
        const editor = mockMethods<Editor>(['replaceEntireTextWith'], {
            entireText: 'ENTIRE_TEXT',
            filePath: 'FILE_NAME'
        });
        when(wrapEditor(rawEditor)).thenReturn(editor);
        const workspaceAdapter = mockType<Workspace>({
            getConfig: (key: string) => key === 'editWithShell.processEntireTextIfNoneSelected'
        });
        const command = new RunCommand(
            shellCommandService,
            mockType<CommandReader>({read: () => Promise.resolve('COMMAND_STRING')}),
            historyStore,
            wrapEditor,
            workspaceAdapter,
            mockType<ShowErrorMessage>(),
            mockType<Logger>()
        );

        await command.execute(rawEditor);

        verify(editor.replaceEntireTextWith('COMMAND_OUTPUT'));
    });

    it('does not try to run a command if one is not given', async () => {
        const historyStore = mock(HistoryStore);
        const shellCommandService = mock(ShellCommandService);
        const editor = mock(Editor);
        const wrapEditor = mockFunction() as WrapEditor;
        when(wrapEditor(rawEditor)).thenReturn(editor);
        const command = new RunCommand(
            shellCommandService,
            mockType<CommandReader>({read: () => Promise.resolve()}),
            historyStore,
            wrapEditor,
            mockType<Workspace>(),
            mockType<ShowErrorMessage>(),
            mockType<Logger>()
        );

        await command.execute(rawEditor);

        verify(editor.replaceSelectedTextWith(any()), {times: 0});
        verify(shellCommandService.runCommand(any()), {times: 0});
        verify(historyStore.add(any()), {times: 0});
    });

    it('reports an error', async () => {
        const logger = mockMethods<Logger>(['error']);
        const showErrorMessage = mockFunction() as ShowErrorMessage;
        const wrapEditor = mockFunction() as WrapEditor;
        when(wrapEditor(rawEditor)).thenReturn(mock(Editor));

        const command = new RunCommand(
            mock(ShellCommandService),
            mockType<CommandReader>({
                read: () => Promise.reject(new Error('UNEXPECTED_ERROR'))
            }),
            mock(HistoryStore),
            wrapEditor,
            mockType<Workspace>(),
            showErrorMessage,
            logger
        );

        await command.execute(rawEditor);

        verify(showErrorMessage(contains('UNEXPECTED\\_ERROR')));
        verify(logger.error(contains('Error: UNEXPECTED_ERROR')));
    });

});
