import {HistoryStore} from './history-store';
import * as vscode from 'vscode';

export class CommandReader {
    constructor(private readonly historyStore: HistoryStore,
                private readonly vsWindow: typeof vscode.window) {}

    async read() {
        const history = await this.historyStore.getAll();
        if (history.length === 0) {
            return this.vsWindow.showInputBox({
                placeHolder: 'Enter a command',
                prompt: 'No history available yet'
            });
        }

        const pickedCommand = await this.letUserToPickCommand(history);
        return this.letUserToModifyCommand(pickedCommand);
    }

    private letUserToPickCommand(history: string[]): Thenable<string | undefined> {
        const options = {placeHolder: 'Select a command to reuse or Cancel (Esc) to write a new command'};
        return this.vsWindow.showQuickPick(history.reverse(), options);
    }

    private letUserToModifyCommand(pickedCommand?: string) {
        const options = this.getInputBoxOption(pickedCommand);
        return this.vsWindow.showInputBox(options);
    }

    private getInputBoxOption(pickedCommand?: string) {
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
