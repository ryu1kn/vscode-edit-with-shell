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
    private readonly _logger: Logger;
    private readonly _shellCommandService: ShellCommandService;
    private readonly _commandReader: CommandReader;
    private readonly _historyStore: HistoryStore;
    private readonly _showErrorMessage: ShowErrorMessage;
    private readonly _wrapEditor: (editor: VsTextEditor, lf?: LocationFactory) => Editor;
    private readonly _workspaceAdapter: Workspace;
    private readonly _errorMessageFormatter: ErrorMessageFormatter;

    constructor(shellCommandService: ShellCommandService,
                commandReader: CommandReader,
                historyStore: HistoryStore,
                wrapEditor: WrapEditor,
                workspaceAdapter: Workspace,
                showErrorMessage: ShowErrorMessage,
                logger: Logger) {
        this._logger = logger;
        this._shellCommandService = shellCommandService;
        this._commandReader = commandReader;
        this._historyStore = historyStore;
        this._showErrorMessage = showErrorMessage;
        this._wrapEditor = wrapEditor;
        this._workspaceAdapter = workspaceAdapter;
        this._errorMessageFormatter = new ErrorMessageFormatter();
    }

    async execute(editor: VsTextEditor) {
        const wrappedEditor = this._wrapEditor(editor);
        try {
            const command = await this._commandReader.read();
            if (!command) return;

            this._historyStore.add(command);
            const processEntireText = this._workspaceAdapter
                .getConfig(`${EXTENSION_NAME}.processEntireTextIfNoneSelected`);
            if (processEntireText) {
                const commandOutput = await this._shellCommandService.runCommand({
                    command,
                    input: wrappedEditor.entireText,
                    filePath: wrappedEditor.filePath
                });
                await wrappedEditor.replaceEntireTextWith(commandOutput);
            } else {
                const commandOutput = await this._shellCommandService.runCommand({
                    command,
                    input: wrappedEditor.selectedText,
                    filePath: wrappedEditor.filePath
                });
                await wrappedEditor.replaceSelectedTextWith(commandOutput);
            }
        } catch (e) {
            await this._handleError(e);
        }
    }

    async _handleError(e: Error | CommandExecutionError) {
        this._logger.error(e.stack);

        const sourceMessage = e instanceof CommandExecutionError ? e.errorOutput : e.message;
        const errorMessage = this._errorMessageFormatter.format(sourceMessage);
        await this._showErrorMessage(errorMessage);
    }

}
