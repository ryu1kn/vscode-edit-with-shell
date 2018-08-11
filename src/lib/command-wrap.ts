import {ShowErrorMessage} from './types/vscode';
import {Logger} from './logger';
import {WrapEditor} from './adapters/editor';
import {TextEditor as VsTextEditor} from 'vscode';
import CommandExecutionError from './errors/command';
import ErrorMessageFormatter from './error-message-formatter';
import {ExtensionCommand} from './commands/extension-command';

export default class CommandWrap {
    private readonly command: ExtensionCommand;
    private readonly showErrorMessage: ShowErrorMessage;
    private readonly logger: Logger;
    private readonly errorMessageFormatter: ErrorMessageFormatter;
    private readonly wrapEditor: WrapEditor;

    constructor(command: ExtensionCommand, wrapEditor: WrapEditor, showErrorMessage: ShowErrorMessage, logger: Logger) {
        this.command = command;
        this.wrapEditor = wrapEditor;
        this.showErrorMessage = showErrorMessage;
        this.logger = logger;
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
