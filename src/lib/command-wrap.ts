import {ShowErrorMessage} from './types/vscode';
import {Logger} from './logger';
import {WrapEditor} from './adapters/editor';
import {TextEditor as VsTextEditor} from 'vscode';
import {CommandExecutionError} from './errors/command';
import {ErrorMessageFormatter} from './error-message-formatter';
import {ExtensionCommand} from './commands/extension-command';

export class CommandWrap {
    private readonly errorMessageFormatter: ErrorMessageFormatter;

    constructor(private readonly command: ExtensionCommand,
                private readonly wrapEditor: WrapEditor,
                private readonly showErrorMessage: ShowErrorMessage,
                private readonly logger: Logger) {
        this.errorMessageFormatter = new ErrorMessageFormatter();
    }

    async execute(editor?: VsTextEditor) {
        try {
            await this.command.execute(editor && this.wrapEditor(editor));
        } catch (e) {
            this.handleError(e);
        }
    }

    async handleError(e: Error | CommandExecutionError) {
        this.logger.error(e.stack);

        const sourceMessage = e instanceof CommandExecutionError ? e.errorOutput : e.message;
        const errorMessage = this.errorMessageFormatter.format(sourceMessage);
        await this.showErrorMessage(errorMessage);
    }
}
