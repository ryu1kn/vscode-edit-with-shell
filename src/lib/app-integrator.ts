import {EXTENSION_NAME} from './const';
import RunCommand from './commands/run';
import ClearHistoryCommand from './commands/clear-history';
import {ExecutionContextLike} from './types/vscode';

export default class AppIntegrator {
    private _vscode: any;
    private _runCommand: RunCommand;
    private _clearHistoryCommand: ClearHistoryCommand;

    constructor(runCommand: RunCommand, clearHistoryCommand: ClearHistoryCommand, vscode: any) {
        this._vscode = vscode;
        this._runCommand = runCommand;
        this._clearHistoryCommand = clearHistoryCommand;
    }

    integrate(context: ExecutionContextLike) {
        this._registerCommands(context);
        this._registerTextEditorCommands(context);
    }

    _registerCommands(context: ExecutionContextLike) {
        const disposable = this._vscode.commands.registerCommand(
            `${EXTENSION_NAME}.clearCommandHistory`,
            this._clearHistoryCommand.execute,
            this._clearHistoryCommand
        );
        context.subscriptions.push(disposable);
    }

    _registerTextEditorCommands(context: ExecutionContextLike) {
        const disposable = this._vscode.commands.registerTextEditorCommand(
            `${EXTENSION_NAME}.runCommand`,
            this._runCommand.execute,
            this._runCommand
        );
        context.subscriptions.push(disposable);
    }

}
