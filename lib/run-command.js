
const ErrorMessageFormatter = require('./error-message-formatter');

class RunCommand {

    constructor(params) {
        this._logger = params.logger;
        this._shellCommandService = params.shellCommandService;
        this._commandReader = params.commandReader;
        this._historyStore = params.historyStore;
        this._showErrorMessage = params.showErrorMessage;
        this._wrapEditor = params.wrapEditor;
        this._errorMessageFormatter = new ErrorMessageFormatter();
    }

    execute(editor) {
        const state = {editor: this._wrapEditor(editor)};
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
                const errorMessage = this._errorMessageFormatter.format(e.errorOutput || e.message);
                this._showErrorMessage(errorMessage);
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

}

module.exports = RunCommand;
