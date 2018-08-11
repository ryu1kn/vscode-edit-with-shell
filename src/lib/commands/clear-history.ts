import ErrorMessageFormatter from '../error-message-formatter';
import HistoryStore from '../history-store';
import {Logger} from '../logger';

export default class ClearHistoryCommand {
    private _historyStore: HistoryStore;
    private _logger: Logger;
    private _showErrorMessage: (message: string) => Promise<void>;
    private _errorMessageFormatter: ErrorMessageFormatter;

    constructor(params) {
        this._historyStore = params.historyStore;
        this._logger = params.logger;
        this._showErrorMessage = params.showErrorMessage;
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
