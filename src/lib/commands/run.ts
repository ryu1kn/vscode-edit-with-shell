import ErrorMessageFormatter from '../error-message-formatter';

import {EXTENSION_NAME} from '../const';

export default class RunCommand {
    private _logger: any;
    private _shellCommandService: any;
    private _commandReader: any;
    private _historyStore: any;
    private _showErrorMessage: any;
    private _wrapEditor: any;
    private _workspaceAdapter: any;
    private _errorMessageFormatter: ErrorMessageFormatter;

    constructor(params) {
        this._logger = params.logger;
        this._shellCommandService = params.shellCommandService;
        this._commandReader = params.commandReader;
        this._historyStore = params.historyStore;
        this._showErrorMessage = params.showErrorMessage;
        this._wrapEditor = params.wrapEditor;
        this._workspaceAdapter = params.workspaceAdapter;
        this._errorMessageFormatter = new ErrorMessageFormatter();
    }

    async execute(editor?) {
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

    async _handleError(e) {
        this._logger.error(e.stack);

        const errorMessage = this._errorMessageFormatter.format(e.errorOutput || e.message);
        await this._showErrorMessage(errorMessage);
    }

}
