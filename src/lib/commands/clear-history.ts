import HistoryStore from '../history-store';
import {ExtensionCommand} from './extension-command';

export default class ClearHistoryCommand implements ExtensionCommand {
    private readonly historyStore: HistoryStore;

    constructor(historyStore: HistoryStore) {
        this.historyStore = historyStore;
    }

    async execute() {
        this.historyStore.clear();
    }

}
