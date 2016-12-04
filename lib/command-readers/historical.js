
class HistoricalCommandReader {

    constructor(params) {
        this._historyStore = params.historyStore;
        this._vsWindow = params.vsWindow;
    }

    read() {
        const history = this._historyStore.getAll();
        if (history.length === 0) {
            return this._vsWindow.showInputBox({
                placeHolder: 'Enter a command',
                prompt: 'No history available yet'
            });
        }

        const state = {history};
        return Promise.resolve(state)
            .then(state => this._letUserToPickCommand(state))
            .then(state => this._letUserToModifyCommand(state))
            .then(state => state.finalCommand);
    }

    _letUserToPickCommand(state) {
        const options = {placeHolder: 'Select a command to reuse or Cancel (Esc) to write a new command'};
        return this._vsWindow.showQuickPick(state.history.reverse(), options)
            .then(pickedCommand => Object.assign({}, state, {pickedCommand}));
    }

    _letUserToModifyCommand(state) {
        const options = this._getInputBoxOption(state.pickedCommand);
        return this._vsWindow.showInputBox(options)
            .then(finalCommand => Object.assign({}, state, {finalCommand}));
    }

    _getInputBoxOption(pickedCommand) {
        if (!pickedCommand) {
            return {placeHolder: 'Enter a command'};
        }
        return {
            placeHolder: 'Enter a command',
            prompt: 'Edit the command if necessary',
            value: pickedCommand
        };
    }

}

module.exports = HistoricalCommandReader;
