import ErrorMessageFormatter from '../error-message-formatter';
import HistoryStore from '../history-store';
import {Logger} from '../logger';
import {ShowErrorMessage} from '../types/vscode';

export default class ClearHistoryCommand {
    private readonly _historyStore: HistoryStore;
    private readonly _logger: Logger;
    private readonly _showErrorMessage: ShowErrorMessage;
    private readonly _errorMessageFormatter: ErrorMessageFormatter;

    constructor(historyStore: HistoryStore, showErrorMessage: ShowErrorMessage, logger: Logger) {
        this._historyStore = historyStore;
        this._logger = logger;
        this._showErrorMessage = showErrorMessage;
        this._errorMessageFormatter = new ErrorMessageFormatter();
    }

    async execute() {
        try {
            this._historyStore.clear();
        } catch (e) {
            this._logger.error(e.stack);
            this._showErrorMessage(this._errorMessageFormatter.format(e.message));
        }
    }

}
