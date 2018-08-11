import ErrorMessageFormatter from '../error-message-formatter';
import HistoryStore from '../history-store';
import {Logger} from '../logger';
import {ShowErrorMessage} from '../types/vscode';

export default class ClearHistoryCommand {
    private readonly historyStore: HistoryStore;
    private readonly logger: Logger;
    private readonly showErrorMessage: ShowErrorMessage;
    private readonly errorMessageFormatter: ErrorMessageFormatter;

    constructor(historyStore: HistoryStore, showErrorMessage: ShowErrorMessage, logger: Logger) {
        this.historyStore = historyStore;
        this.logger = logger;
        this.showErrorMessage = showErrorMessage;
        this.errorMessageFormatter = new ErrorMessageFormatter();
    }

    async execute() {
        try {
            this.historyStore.clear();
        } catch (e) {
            this.logger.error(e.stack);
            this.showErrorMessage(this.errorMessageFormatter.format(e.message));
        }
    }

}
