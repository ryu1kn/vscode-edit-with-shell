
class HistoricalCommandReader {

    constructor(params) {
        this._historyStore = params.historyStore;
        this._vsWindow = params.vsWindow;
    }

    read() {
        const history = this._historyStore.getAll();
        if (history.length === 0) return this._vsWindow.showInputBox();
        return this._vsWindow.showQuickPick(history)
            .then(selectedCommand => this._vsWindow.showInputBox({value: selectedCommand}));
    }

}

module.exports = HistoricalCommandReader;
