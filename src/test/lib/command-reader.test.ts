import * as assert from 'assert';
import {any, mockMethods, mockType, verify, when} from '../helper';

import {CommandReader} from '../../lib/command-reader';
import * as vscode from 'vscode';
import {HistoryStore} from '../../lib/history-store';

describe('CommandReader', () => {

    it('allows user to pick and modify a past command. Commands shown last one first', async () => {
        const historyStore = mockType<HistoryStore>({getAll: () => ['COMMAND_1', 'COMMAND_2']});
        const vscodeWindow = mockMethods<typeof vscode.window>(['showInputBox', 'showQuickPick']);
        when(vscodeWindow.showQuickPick(
            ['COMMAND_2', 'COMMAND_1'],
            {placeHolder: 'Select a command to reuse or Cancel (Esc) to write a new command'}
        )).thenResolve('COMMAND_1');
        when(vscodeWindow.showInputBox({
            placeHolder: 'Enter a command',
            prompt: 'Edit the command if necessary',
            value: 'COMMAND_1'
        })).thenResolve('COMMAND_FINAL');
        const reader = new CommandReader(historyStore, vscodeWindow);
        const command = await reader.read();

        assert.deepEqual(command, 'COMMAND_FINAL');
    });

    it('shows inputBox right away if there is no commands recorded in the history', async () => {
        const vscodeWindow = mockMethods<typeof vscode.window>(['showInputBox', 'showQuickPick']);
        when(vscodeWindow.showInputBox({
            placeHolder: 'Enter a command',
            prompt: 'No history available yet'
        })).thenResolve('COMMAND');
        const historyStore = mockType<HistoryStore>({getAll: () => []});
        const reader = new CommandReader(historyStore, vscodeWindow);
        const command = await reader.read();

        assert.deepEqual(command, 'COMMAND');
        verify(vscodeWindow.showQuickPick(any()), {times: 0, ignoreExtraArgs: true});
    });

    it('shows inputBox if history command picker is dismissed', async () => {
        const vscodeWindow = mockMethods<typeof vscode.window>(['showInputBox'], {
            showQuickPick: () => Promise.resolve()
        });
        when(vscodeWindow.showInputBox({placeHolder: 'Enter a command'})).thenResolve('COMMAND');

        const historyStore = mockType<HistoryStore>({getAll: () => ['COMMAND_1', 'COMMAND_2']});
        const reader = new CommandReader(historyStore, vscodeWindow);
        const command = await reader.read();

        assert.deepEqual(command, 'COMMAND');
    });

});
