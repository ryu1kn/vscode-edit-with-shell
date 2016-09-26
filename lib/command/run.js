
'use strict';

const vscode = require('vscode');   // TODO: Do dependency injection

class RunCommand {

    constructor(params) {
        this._logger = params.logger;
    }

    execute(_editor) {
        // NOTE: Just echoing the user input now
        return Promise.resolve()
            .then(() => vscode.window.showInputBox())
            .then(text => vscode.window.showInformationMessage(text))
            .catch(e => {
                this._logger.error(e.stack);
            });
    }

}

module.exports = RunCommand;
