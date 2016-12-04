
const Const = require('./const');

class AppIntegrator {

    constructor(params) {
        this._vscode = params.vscode;
        this._runCommand = params.runCommand;
        this._reuseCommand = params.reuseCommand;
    }

    integrate(context) {
        this._registerTextEditorCommands(context);
    }

    _registerTextEditorCommands(context) {
        this._commandList.forEach(commandDef => {
            const disposable = this._vscode.commands.registerTextEditorCommand(
                `${Const.EXTENSION_NAME}.${commandDef.name}`,
                commandDef.command.execute,
                commandDef.command
            );
            context.subscriptions.push(disposable);
        });
    }

    get _commandList() {
        return [
            {
                name: 'runCommand',
                command: this._runCommand
            },
            {
                name: 'reuseCommand',
                command: this._reuseCommand
            }
        ];
    }

}

module.exports = AppIntegrator;
