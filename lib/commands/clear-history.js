
const ErrorMessageFormatter = require('../error-message-formatter');

class ClearHistoryCommand {

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

module.exports = ClearHistoryCommand;
