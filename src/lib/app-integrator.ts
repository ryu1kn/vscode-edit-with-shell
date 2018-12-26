import {EXTENSION_NAME} from './const';
import {ExecutionContextLike} from './types/vscode';
import CommandWrap from './command-wrap';

interface CommandHandlerInfo {
    id: string;
    command: CommandWrap;
}

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

    private registerTextEditorCommands(context: ExecutionContextLike): void {
        this.textEditorCommands.forEach(command => {
            const disposable = this.vscode.commands.registerTextEditorCommand(
                command.id,
                command.command.execute,
                command.command
            );
            context.subscriptions.push(disposable);
        });
    }

    private get textEditorCommands(): CommandHandlerInfo[] {
        return [
            {
                id: `${EXTENSION_NAME}.runCommand`,
                command: this.runCommand
            },
            ...[1, 2, 3, 4, 5].map(n => ({
                id: `${EXTENSION_NAME}.runQuickCommand${n}`,
                command: this.createQuickCommand(n)
            }))
        ];
    }
}
