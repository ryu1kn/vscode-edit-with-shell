
const Editor = require('./editor');

class RunCommand {

    constructor(params) {
        this._logger = params.logger;
        this._shellCommandService = params.shellCommandService;
        this._commandReader = params.commandReader;
        this._historyStore = params.historyStore;
        this._showErrorMessage = params.showErrorMessage;
    }

    execute(editor) {
        const state = {editor: new Editor(editor)};
        return Promise.resolve(state)
            .then(state => this._readCommand(state))
            .then(state => {
                if (!state.command) return;
                return Promise.resolve(state)
                    .then(state => this._recordCommand(state))
                    .then(state => this._runCommand(state))
                    .then(state => this._updateEditorContent(state));
            })
            .catch(e => {
                this._showErrorMessage(this._formatErrorMessage(e.errorOutput || e.message));
                this._logger.error(e.stack);
            });
    }

    _readCommand(state) {
        return this._commandReader.read()
            .then(command => Object.assign({}, state, {command}));
    }

    _recordCommand(state) {
        this._historyStore.add(state.command);
        return state;
    }

    _runCommand(state) {
        const params = {
            command: state.command,
            input: state.editor.selectedText,
            filePath: state.editor.filePath
        };
        return this._shellCommandService.runCommand(params)
            .then(output => Object.assign({}, state, {commandOutput: output}));
    }

    _updateEditorContent(state) {
        return state.editor.replaceSelectedTextWith(state.commandOutput);
    }

    _formatErrorMessage(message) {
        const trimmedMessage = (message || '').trim();
        return replaceAll(trimmedMessage, '\n', '\\n');
    }

}

function replaceAll(string, fromStr, toStr) {
    return string.split(fromStr).join(toStr);
}

module.exports = RunCommand;
