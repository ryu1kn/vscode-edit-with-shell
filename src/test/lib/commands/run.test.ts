import RunCommand from '../../../lib/commands/run';
import Workspace from '../../../lib/adapters/workspace';
import Editor from '../../../lib/adapters/editor';
import ShellCommandService from '../../../lib/shell-command-service';
import HistoryStore from '../../../lib/history-store';
import {any, mock, mockMethods, mockType, verify, when} from '../../helper';
import CommandReader from '../../../lib/command-reader';

describe('RunCommand', () => {

    describe('When command is specified and "processEntireTextIfNoneSelected" is set to "false"', () => {
        const commandReader = mockType<CommandReader>({read: () => Promise.resolve('COMMAND_STRING')});
        const workspaceAdapter = mockType<Workspace>({
            getConfig: (key: string) => key === 'editWithShell.processEntireTextIfNoneSelected' && false
        });

        let shellCommandService: ShellCommandService;
        let historyStore: HistoryStore;
        let command: RunCommand;

        beforeEach(() => {
            shellCommandService = mock(ShellCommandService);
            when(shellCommandService.runCommand({
                command: 'COMMAND_STRING',
                input: 'SELECTED_TEXT',
                filePath: 'FILE_NAME'
            })).thenResolve('COMMAND_OUTPUT_1');
            when(shellCommandService.runCommand({
                command: 'COMMAND_STRING',
                input: '',
                filePath: 'FILE_NAME'
            })).thenResolve('COMMAND_OUTPUT_2');

            historyStore = mock(HistoryStore);
            command = new RunCommand(shellCommandService, commandReader, historyStore, workspaceAdapter);
        });

        it('runs command with selected text and add commands to the history', async () => {
            const editor = mockMethods<Editor>(['replaceSelectedTextWith'], {
                selectedText: 'SELECTED_TEXT',
                entireText: 'ENTIRE_TEXT',
                filePath: 'FILE_NAME'
            });

            await command.execute(editor);

            verify(editor.replaceSelectedTextWith('COMMAND_OUTPUT_1'));
            verify(historyStore.add('COMMAND_STRING'));
        });

        it('runs command with no input text', async () => {
            const editor = mockMethods<Editor>(['replaceSelectedTextWith'], {
                selectedText: '',
                entireText: 'ENTIRE_TEXT',
                filePath: 'FILE_NAME'
            });

            await command.execute(editor);

            verify(editor.replaceSelectedTextWith('COMMAND_OUTPUT_2'));
        });
    });

    describe('When command is specified and "processEntireTextIfNoneSelected" is set to "true"', () => {
        const commandReader = mockType<CommandReader>({read: () => Promise.resolve('COMMAND_STRING')});
        const workspaceAdapter = mockType<Workspace>({
            getConfig: (key: string) => key === 'editWithShell.processEntireTextIfNoneSelected'
        });

        let shellCommandService: ShellCommandService;
        let historyStore: HistoryStore;
        let command: RunCommand;

        beforeEach(() => {
            shellCommandService = mock(ShellCommandService);
            when(shellCommandService.runCommand({
                command: 'COMMAND_STRING',
                input: 'SELECTED_TEXT',
                filePath: 'FILE_NAME'
            })).thenResolve('COMMAND_OUTPUT_1');
            when(shellCommandService.runCommand({
                command: 'COMMAND_STRING',
                input: 'ENTIRE_TEXT',
                filePath: 'FILE_NAME'
            })).thenResolve('COMMAND_OUTPUT_2');

            historyStore = mock(HistoryStore);
            command = new RunCommand(shellCommandService, commandReader, historyStore, workspaceAdapter);
        });

        it('runs command with selected text', async () => {
            const editor = mockMethods<Editor>(['replaceSelectedTextWith'], {
                selectedText: 'SELECTED_TEXT',
                entireText: 'ENTIRE_TEXT',
                filePath: 'FILE_NAME'
            });

            await command.execute(editor);

            verify(editor.replaceSelectedTextWith('COMMAND_OUTPUT_1'));
        });

        it('runs command with entire text', async () => {
            const editor = mockMethods<Editor>(['replaceEntireTextWith'], {
                selectedText: '',
                entireText: 'ENTIRE_TEXT',
                filePath: 'FILE_NAME'
            });

            await command.execute(editor);

            verify(editor.replaceEntireTextWith('COMMAND_OUTPUT_2'));
        });
    });

    describe('When command is NOT specified', () => {

        it('does not try to run a command', async () => {
            const historyStore = mock(HistoryStore);
            const shellCommandService = mock(ShellCommandService);
            const editor = mock(Editor);
            const command = new RunCommand(
                shellCommandService,
                mockType<CommandReader>({read: () => Promise.resolve()}),
                historyStore,
                mockType<Workspace>()
            );

            await command.execute(editor);

            verify(editor.replaceSelectedTextWith(any()), {times: 0});
            verify(shellCommandService.runCommand(any()), {times: 0});
            verify(historyStore.add(any()), {times: 0});
        });
    });
});
