import {HistoryStore} from './history-store';
import * as vscode from 'vscode';
import {EXTENSION_NAME} from './const';
import {Workspace} from './adapters/workspace';

export class CommandReader {
    private displayPrompt: boolean;
    
    constructor(private readonly historyStore: HistoryStore,
                private readonly vsWindow: typeof vscode.window,
                private readonly workspaceAdapter: Workspace) {
                    this.workspaceAdapter = workspaceAdapter;
                    this.displayPrompt = this.workspaceAdapter.getConfig<boolean>(`${EXTENSION_NAME}.promptModifyCommand`);
                }

    async read() {
        const history = this.historyStore.getAll();
        if (history.length === 0) {
            return this.vsWindow.showInputBox({
                placeHolder: 'Enter a command',
                prompt: 'No history available yet'
            });
        }

        const pickedCommand = await this.letUserToPickCommand(history);
        return this.displayPrompt ? this.letUserToModifyCommand(pickedCommand) : pickedCommand;
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
