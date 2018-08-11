import ErrorMessageFormatter from '../error-message-formatter';

export default class ClearHistoryCommand {
    private _historyStore: any;
    private _logger: any;
    private _showErrorMessage: any;
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
