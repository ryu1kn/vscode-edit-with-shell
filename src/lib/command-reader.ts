import HistoryStore from './history-store';
import * as vscode from 'vscode';

export default class CommandReader {
    private _historyStore: HistoryStore;
    private _vsWindow: typeof vscode.window;

    constructor(historyStore: HistoryStore, vsWindow: typeof vscode.window) {
        this._historyStore = historyStore;
        this._vsWindow = vsWindow;
    }

    async read() {
        const history = this._historyStore.getAll();
        if (history.length === 0) {
            return this._vsWindow.showInputBox({
                placeHolder: 'Enter a command',
                prompt: 'No history available yet'
            });
        }

        const pickedCommand = await this._letUserToPickCommand(history);
        return this._letUserToModifyCommand(pickedCommand);
    }

    _letUserToPickCommand(history: string[]): Thenable<string | undefined> {
        const options = {placeHolder: 'Select a command to reuse or Cancel (Esc) to write a new command'};
        return this._vsWindow.showQuickPick(history.reverse(), options);
    }

    _letUserToModifyCommand(pickedCommand?: string) {
        const options = this._getInputBoxOption(pickedCommand);
        return this._vsWindow.showInputBox(options);
    }

    _getInputBoxOption(pickedCommand?: string) {
        if (!pickedCommand) {
            return {placeHolder: 'Enter a command'};
        }
        return {
            placeHolder: 'Enter a command',
            prompt: 'Edit the command if necessary',
            value: pickedCommand
        };
    }

}
