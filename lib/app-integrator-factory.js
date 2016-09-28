
'use strict';

const childProcess = require('child_process');
const vscode = require('vscode');

const AppIntegrator = require('./app-integrator');
const ShellCommandService = require('./shell-command-service');
const CommandReader = require('./command-reader');
const ProcessRunner = require('./process-runner');
const RunCommand = require('./run-command');

class AppIntegratorFactory {

    create() {
        return new AppIntegrator({
            vscode,
            runCommand: this._runCommand
        });
    }

    get _logger() {
        return console;
    }

    get _runCommand() {
        return new RunCommand({
            logger: this._logger,
            commandReader: this._commandReader,
            shellCommandService: this._shellCommandService,
            showErrorMessage: message => vscode.window.showErrorMessage(message)
        });
    }

    get _commandReader() {
        return new CommandReader({vsWindow: vscode.window});
    }

    get _shellCommandService() {
        return new ShellCommandService({
            childProcess,
            getEnvVars: () => process.env,
            processRunner: new ProcessRunner()
        });
    }
}

module.exports = AppIntegratorFactory;
