import {EXTENSION_NAME} from './const';
import {ExecutionContextLike} from './types/vscode';
import CommandWrap from './command-wrap';

export default class AppIntegrator {
    private readonly vscode: any;
    private readonly runCommand: CommandWrap;
    private readonly clearHistoryCommand: CommandWrap;

    constructor(runCommand: CommandWrap, clearHistoryCommand: CommandWrap, vscode: any) {
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
