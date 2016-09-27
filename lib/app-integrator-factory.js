
'use strict';

const childProcess = require('child_process');
const vscode = require('vscode');

const AppIntegrator = require('./app-integrator');
const CommandRunner = require('./command-runner');
const CommandReader = require('./command-reader');
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
            commandRunner: this._commandRunner
        });
    }

    get _commandReader() {
        return new CommandReader({vsWindow: vscode.window});
    }

    get _commandRunner() {
        return new CommandRunner({
            childProcess,
            getEnvVars: () => process.env
        });
    }
}

module.exports = AppIntegratorFactory;
