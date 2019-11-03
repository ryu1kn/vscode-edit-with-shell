import RunQuickCommand from '../../../lib/commands/run-quick';
import Workspace from '../../../lib/adapters/workspace';
import {Editor} from '../../../lib/adapters/editor';
import {ShellCommandService} from '../../../lib/shell-command-service';
import {HistoryStore} from '../../../lib/history-store';
import {any, mock, mockMethods, verify, when} from '../../helper';

describe('RunQuickCommand', () => {

    describe('When command is specified and "processEntireTextIfNoneSelected" is set to "false"', () => {
        const workspaceAdapter = mockMethods<Workspace>(['getConfig']);
        when(workspaceAdapter.getConfig('editWithShell.processEntireTextIfNoneSelected')).thenReturn(false);
        when(workspaceAdapter.getConfig('editWithShell.quickCommand1')).thenReturn('favourite-command-1');
        when(workspaceAdapter.getConfig('editWithShell.favoriteCommands')).thenReturn([
            {id: 'favourite-command-1', command: 'COMMAND_STRING'}
        ]);

        let shellCommandService: ShellCommandService;
        let historyStore: HistoryStore;
        let command: RunQuickCommand;

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
            command = new RunQuickCommand(shellCommandService, historyStore, workspaceAdapter, 1);
        });

        it('runs command with selected text and add commands to the history', async () => {
            const editor = mockMethods<Editor>(['replaceSelectedTextsWith'], {
                isTextSelected: true,
                selectedTexts: ['SELECTED_TEXT'],
                entireText: 'ENTIRE_TEXT',
                filePath: 'FILE_NAME'
            });

            await command.execute(editor);

            verify(editor.replaceSelectedTextsWith(['COMMAND_OUTPUT_1']));
            verify(historyStore.add('COMMAND_STRING'));
        });

        it('runs command with no input text', async () => {
            const editor = mockMethods<Editor>(['replaceSelectedTextsWith'], {
                isTextSelected: false,
                selectedTexts: [''],
                entireText: 'ENTIRE_TEXT',
                filePath: 'FILE_NAME'
            });

            await command.execute(editor);

            verify(editor.replaceSelectedTextsWith(['COMMAND_OUTPUT_2']));
        });
    });

    describe('When command is specified and "processEntireTextIfNoneSelected" is set to "true"', () => {
        const workspaceAdapter = mockMethods<Workspace>(['getConfig']);
        when(workspaceAdapter.getConfig('editWithShell.processEntireTextIfNoneSelected')).thenReturn(true);
        when(workspaceAdapter.getConfig('editWithShell.quickCommand1')).thenReturn('favourite-command-1');
        when(workspaceAdapter.getConfig('editWithShell.favoriteCommands')).thenReturn([
            {id: 'favourite-command-1', command: 'COMMAND_STRING'}
        ]);

        let shellCommandService: ShellCommandService;
        let historyStore: HistoryStore;
        let command: RunQuickCommand;

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
            command = new RunQuickCommand(shellCommandService, historyStore, workspaceAdapter, 1);
        });

        it('runs command with selected text', async () => {
            const editor = mockMethods<Editor>(['replaceSelectedTextsWith'], {
                isTextSelected: true,
                selectedTexts: ['SELECTED_TEXT'],
                entireText: 'ENTIRE_TEXT',
                filePath: 'FILE_NAME'
            });

            await command.execute(editor);

            verify(editor.replaceSelectedTextsWith(['COMMAND_OUTPUT_1']));
        });

        it('runs command with entire text', async () => {
            const editor = mockMethods<Editor>(['replaceEntireTextWith'], {
                isTextSelected: false,
                selectedTexts: [''],
                entireText: 'ENTIRE_TEXT',
                filePath: 'FILE_NAME'
            });

            await command.execute(editor);

            verify(editor.replaceEntireTextWith('COMMAND_OUTPUT_2'));
        });
    });

    describe('When command is NOT specified', () => {
        const workspaceAdapter = mockMethods<Workspace>(['getConfig']);
        when(workspaceAdapter.getConfig('editWithShell.quickCommand1')).thenReturn('');
        when(workspaceAdapter.getConfig('editWithShell.favoriteCommands')).thenReturn([]);

        it('does not try to run a command', async () => {
            const historyStore = mock(HistoryStore);
            const shellCommandService = mock(ShellCommandService);
            const editor = mock(Editor);
            const command = new RunQuickCommand(shellCommandService, historyStore, workspaceAdapter, 1);

            await command.execute(editor);

            verify(editor.replaceSelectedTextsWith(any()), {times: 0});
            verify(shellCommandService.runCommand(any()), {times: 0});
            verify(historyStore.add(any()), {times: 0});
        });
    });
});
