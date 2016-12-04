
const Const = require('./const');

class AppIntegrator {

    constructor(params) {
        this._vscode = params.vscode;
        this._runCommand = params.runCommand;
    }

    integrate(context) {
        this._registerTextEditorCommands(context);
    }

    _registerTextEditorCommands(context) {
        const disposable = this._vscode.commands.registerTextEditorCommand(
            `${Const.EXTENSION_NAME}.runCommand`,
            this._runCommand.execute,
            this._runCommand
        );
        context.subscriptions.push(disposable);
    }

}

module.exports = AppIntegrator;
