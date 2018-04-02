
const Const = require('./const');

class AppIntegrator {

    constructor(params) {
        this._vscode = params.vscode;
        this._runCommand = params.runCommand;
        this._clearHistoryCommand = params.clearHistoryCommand;
    }

    integrate(context) {
        this._registerCommands(context);
        this._registerTextEditorCommands(context);
    }

    _registerCommands(context) {
        const disposable = this._vscode.commands.registerCommand(
            `${Const.EXTENSION_NAME}.clearCommandHistory`,
            this._clearHistoryCommand.execute,
            this._clearHistoryCommand
        );
        context.subscriptions.push(disposable);
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
