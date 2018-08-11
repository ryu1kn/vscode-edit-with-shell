import {EXTENSION_NAME} from './const';
import RunCommand from './commands/run';
import ClearHistoryCommand from './commands/clear-history';
import {ExecutionContextLike} from './types/vscode';

export default class AppIntegrator {
    private readonly vscode: any;
    private readonly runCommand: RunCommand;
    private readonly clearHistoryCommand: ClearHistoryCommand;

    constructor(runCommand: RunCommand, clearHistoryCommand: ClearHistoryCommand, vscode: any) {
        this.vscode = vscode;
        this.runCommand = runCommand;
        this.clearHistoryCommand = clearHistoryCommand;
    }

    integrate(context: ExecutionContextLike) {
        this.registerCommands(context);
        this.registerTextEditorCommands(context);
    }

    private registerCommands(context: ExecutionContextLike) {
        const disposable = this.vscode.commands.registerCommand(
            `${EXTENSION_NAME}.clearCommandHistory`,
            this.clearHistoryCommand.execute,
            this.clearHistoryCommand
        );
        context.subscriptions.push(disposable);
    }

    private registerTextEditorCommands(context: ExecutionContextLike) {
        const disposable = this.vscode.commands.registerTextEditorCommand(
            `${EXTENSION_NAME}.runCommand`,
            this.runCommand.execute,
            this.runCommand
        );
        context.subscriptions.push(disposable);
    }

}
