import ErrorMessageFormatter from '../error-message-formatter';
import HistoryStore from '../history-store';
import {Logger} from '../logger';
import {ShowErrorMessage} from '../types/vscode';

export default class ClearHistoryCommand {
    private _historyStore: HistoryStore;
    private _logger: Logger;
    private _showErrorMessage: ShowErrorMessage;
    private _errorMessageFormatter: ErrorMessageFormatter;

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
