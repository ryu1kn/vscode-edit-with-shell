import ErrorMessageFormatter from '../error-message-formatter';
import {EXTENSION_NAME} from '../const';
import {Logger} from '../logger';
import ShellCommandService from '../shell-command-service';
import CommandReader from '../command-reader';
import HistoryStore from '../history-store';
import Workspace from '../adapters/workspace';
import Editor, {LocationFactory, WrapEditor} from '../adapters/editor';
import {TextEditor as VsTextEditor} from 'vscode';
import CommandExecutionError from '../errors/command';
import {ShowErrorMessage} from '../types/vscode';

export default class RunCommand {
    private readonly logger: Logger;
    private readonly shellCommandService: ShellCommandService;
    private readonly commandReader: CommandReader;
    private readonly historyStore: HistoryStore;
    private readonly showErrorMessage: ShowErrorMessage;
    private readonly wrapEditor: (editor: VsTextEditor, lf?: LocationFactory) => Editor;
    private readonly workspaceAdapter: Workspace;
    private readonly errorMessageFormatter: ErrorMessageFormatter;

    constructor(shellCommandService: ShellCommandService,
                commandReader: CommandReader,
                historyStore: HistoryStore,
                wrapEditor: WrapEditor,
                workspaceAdapter: Workspace,
                showErrorMessage: ShowErrorMessage,
                logger: Logger) {
        this.logger = logger;
        this.shellCommandService = shellCommandService;
        this.commandReader = commandReader;
        this.historyStore = historyStore;
        this.showErrorMessage = showErrorMessage;
        this.wrapEditor = wrapEditor;
        this.workspaceAdapter = workspaceAdapter;
        this.errorMessageFormatter = new ErrorMessageFormatter();
    }

    async execute(editor: VsTextEditor) {
        const wrappedEditor = this.wrapEditor(editor);
        try {
            const command = await this.commandReader.read();
            if (!command) return;

            this.historyStore.add(command);
            const processEntireText = this.workspaceAdapter
                .getConfig(`${EXTENSION_NAME}.processEntireTextIfNoneSelected`);
            if (processEntireText) {
                const commandOutput = await this.shellCommandService.runCommand({
                    command,
                    input: wrappedEditor.entireText,
                    filePath: wrappedEditor.filePath
                });
                await wrappedEditor.replaceEntireTextWith(commandOutput);
            } else {
                const commandOutput = await this.shellCommandService.runCommand({
                    command,
                    input: wrappedEditor.selectedText,
                    filePath: wrappedEditor.filePath
                });
                await wrappedEditor.replaceSelectedTextWith(commandOutput);
            }
        } catch (e) {
            await this.handleError(e);
        }
    }

    async handleError(e: Error | CommandExecutionError) {
        this.logger.error(e.stack);

        const sourceMessage = e instanceof CommandExecutionError ? e.errorOutput : e.message;
        const errorMessage = this.errorMessageFormatter.format(sourceMessage);
        await this.showErrorMessage(errorMessage);
    }

}
