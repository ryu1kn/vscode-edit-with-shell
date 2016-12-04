
class RunCommand {

    constructor(params) {
        this._logger = params.logger;
        this._shellCommandService = params.shellCommandService;
        this._commandReader = params.commandReader;
        this._showErrorMessage = params.showErrorMessage;
    }

    execute(editor) {
        const state = {editor};
        return Promise.resolve(state)
            .then(state => this._readCommand(state))
            .then(state => this._runCommand(state))
            .then(state => this._updateEditorContent(state))
            .catch(e => {
                this._showErrorMessage(this._formatErrorMessage(e.errorOutput || e.message));
                this._logger.error(e.stack);
            });
    }

    _readCommand(state) {
        return this._commandReader.read()
            .then(command => Object.assign({}, state, {command}));
    }

    _runCommand(state) {
        const selectedText = state.editor.document.getText(state.editor.selection);
        return this._shellCommandService.runCommand(state.command, selectedText)
            .then(output => Object.assign({}, state, {commandOutput: output}));
    }

    _updateEditorContent(state) {
        return state.editor.edit(editBuilder => {
            editBuilder.replace(state.editor.selection, state.commandOutput);
        });
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
