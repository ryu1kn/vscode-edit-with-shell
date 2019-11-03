
export class HistoryStore {
    private history: string[];

    constructor() {
        this.history = [];
    }

    getAll() {
        return this.history;
    }

    clear() {
        this.history = [];
    }

    add(command: string) {
        const history = this.history;
        const index = history.indexOf(command);
        if (index === -1) {
            this.history = [...history, command];
            return;
        }
        this.history = [...history.slice(0, index), ...history.slice(index + 1), command];
    }

}
