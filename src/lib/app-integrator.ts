import {EXTENSION_NAME} from './const';
import {ExecutionContextLike} from './types/vscode';
import {CommandWrap} from './command-wrap';

interface CommandHandlerInfo {
    id: string;
    command: CommandWrap;
}

export class AppIntegrator {
    constructor(private readonly runCommand: CommandWrap,
                private readonly clearHistoryCommand: CommandWrap,
                private readonly createQuickCommand: (n: number) => CommandWrap,
                private readonly vscode: any) {}

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
            ...Array.from({length: 25}, (_, i) => i + 1).map(n => ({
                id: `${EXTENSION_NAME}.runQuickCommand${n}`,
                command: this.createQuickCommand(n)
            }))
        ];
    }
}
