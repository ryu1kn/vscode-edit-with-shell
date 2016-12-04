
class HistoricalCommandReader {

    constructor(params) {
        this._historyStore = params.historyStore;
        this._vsWindow = params.vsWindow;
    }

    read() {
        const history = this._historyStore.getAll();
        if (history.length === 0) return this._vsWindow.showInputBox();

        const state = {history};
        return Promise.resolve(state)
            .then(state => this._letUserToPickCommand(state))
            .then(state => this._letUserToModifyCommand(state))
            .then(state => state.finalCommand);
    }

    _letUserToPickCommand(state) {
        return this._vsWindow.showQuickPick(state.history.reverse())
            .then(pickedCommand => Object.assign({}, state, {pickedCommand}));
    }

    _letUserToModifyCommand(state) {
        if (!state.pickedCommand) return state;
        return this._vsWindow.showInputBox({value: state.pickedCommand})
            .then(finalCommand => Object.assign({}, state, {finalCommand}));
    }

}

module.exports = HistoricalCommandReader;
