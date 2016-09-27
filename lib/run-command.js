
'use strict';

class RunCommand {

    constructor(params) {
        this._logger = params.logger;
        this._commandRunner = params.commandRunner;
        this._commandReader = params.commandReader;
    }

    execute(editor) {
        const state = {editor};
        return Promise.resolve(state)
            .then(state => this._readCommand(state))
            .then(state => this._runCommand(state))
            .then(state => this._updateEditorContent(state))
            .catch(e => {
                this._logger.error(e.stack);
            });
    }

    _readCommand(state) {
        return this._commandReader.read()
            .then(command => Object.assign({}, state, {command}));
    }

    _runCommand(state) {
        const selectedText = state.editor.document.getText(state.editor.selection);
        return this._commandRunner.run(state.command, selectedText)
            .then(output => Object.assign({}, state, {commandOutput: output}));
    }

    _updateEditorContent(state) {
        return state.editor.edit(editBuilder => {
            editBuilder.replace(state.editor.selection, state.commandOutput);
        });
    }

}

module.exports = RunCommand;
