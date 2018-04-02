
class HistoryStore {

    constructor() {
        this._history = [];
    }

    getAll() {
        return this._history;
    }

    clear() {
        this._history = [];
    }

    add(command) {
        const history = this._history;
        const index = history.indexOf(command);
        if (index === -1) {
            this._history = [...history, command];
            return;
        }
        this._history = [...history.slice(0, index), ...history.slice(index + 1), command];
    }

}

module.exports = HistoryStore;
