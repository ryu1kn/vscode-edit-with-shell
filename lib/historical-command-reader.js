
class CommandReader {

    constructor(params) {
        this._historyStore = params.historyStore;
        this._vsWindow = params.vsWindow;
    }

    read() {
        return this._vsWindow.showQuickPick(this._historyStore.getAll())
            .then(selected => this._vsWindow.showInputBox({value: selected}));
    }

}

module.exports = CommandReader;
