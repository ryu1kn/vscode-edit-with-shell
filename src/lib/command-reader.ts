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
        return (!pickedCommand || this.displayPrompt) ? this.letUserToModifyCommand(pickedCommand) : pickedCommand;
    }

    private letUserToPickCommand(history: string[]): Thenable<string | undefined> {
        if (this.displayPrompt) {
            const options = {placeHolder: 'Select a command to reuse or Cancel (Esc) to write a new command'};
            return this.vsWindow.showQuickPick(history.reverse(), options);
        } else {
            return new Promise((resolve) => {
                const quickPick = this.vsWindow.createQuickPick();
                quickPick.items = history.map(cmd => ({ label: cmd }));
                quickPick.title = 'Select a command or type a new one:';
                quickPick.onDidChangeValue(() => {
                    if (!history.includes(quickPick.value)) {
                        quickPick.items = [quickPick.value, ...history].map(label => ({ label }));
                    }
                })
                quickPick.onDidAccept(() => {
                    const activeItem = quickPick.activeItems[0];
                    resolve(activeItem.label);
                    quickPick.hide();
                })
                quickPick.show();
            });
        }
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
