
'use strict';

const Const = require('./const');

class AppIntegrator {

    constructor(params) {
        this._vscode = params.vscode;
        this._runCommand = params.runCommand;
    }

    integrate(context) {
        this._registerCommands(context);
    }

    _registerCommands(context) {
        this._getCommands().forEach(command => {
            const handler = command.handler;
            const registrar = this._getCommandRegistrar(command.type);
            const disposable = this._vscode.commands[registrar](
                `${Const.EXTENSION_NAME}.${command.name}`,
                handler.execute.bind(handler)
            );
            context.subscriptions.push(disposable);
        });
    }

    _getCommands() {
        return [
            {
                name: 'runCommand',
                type: 'TEXT_EDITOR',
                handler: this._runCommand
            }
        ];
    }

    _getCommandRegistrar(type) {
        switch (type) {
        case 'TEXT_EDITOR':
            return 'registerTextEditorCommand';
        case 'GENERAL':
            return 'registerCommand';
        default:
            throw new Error(`Invalid command type ${type}`);
        }
    }
}

module.exports = AppIntegrator;
