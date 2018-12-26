import {EXTENSION_NAME} from './const';
import {ExecutionContextLike} from './types/vscode';
import CommandWrap from './command-wrap';

export default class AppIntegrator {
    private readonly vscode: any;
    private readonly runCommand: CommandWrap;
    private readonly createQuickCommand: (n: number) => CommandWrap;
    private readonly clearHistoryCommand: CommandWrap;

    constructor(runCommand: CommandWrap, clearHistoryCommand: CommandWrap, createQuickCommand: (n: number) => CommandWrap, vscode: any) {
        this.vscode = vscode;
        this.runCommand = runCommand;
        this.createQuickCommand = createQuickCommand;
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

        const quickCommand1 = this.createQuickCommand(1);
        const disposable1 = this.vscode.commands.registerTextEditorCommand(
            `${EXTENSION_NAME}.runQuickCommand1`,
            quickCommand1.execute,
            quickCommand1
        );
        context.subscriptions.push(disposable1);
    }

}
