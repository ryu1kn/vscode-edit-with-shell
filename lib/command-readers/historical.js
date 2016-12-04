
class HistoricalCommandReader {

    constructor(params) {
        this._historyStore = params.historyStore;
        this._vsWindow = params.vsWindow;
    }

    read() {
        const history = this._historyStore.getAll();
        if (history.length === 0) {
            return this._vsWindow.showInputBox({
                prompt: 'No history available. Enter a new command'
            });
        }

        const state = {history};
        return Promise.resolve(state)
            .then(state => this._letUserToPickCommand(state))
            .then(state => this._letUserToModifyCommand(state))
            .then(state => state.finalCommand);
    }

    _letUserToPickCommand(state) {
        const options = {placeHolder: 'Select a command to reuse'};
        return this._vsWindow.showQuickPick(state.history.reverse(), options)
            .then(pickedCommand => Object.assign({}, state, {pickedCommand}));
    }

    _letUserToModifyCommand(state) {
        if (!state.pickedCommand) return state;

        const options = {
            value: state.pickedCommand,
            prompt: 'Edit the command if necessary'
        };
        return this._vsWindow.showInputBox(options)
            .then(finalCommand => Object.assign({}, state, {finalCommand}));
    }

}

module.exports = HistoricalCommandReader;
