
const childProcess = require('child_process');
const vscode = require('vscode');

const AppIntegrator = require('./app-integrator');
const ShellCommandService = require('./shell-command-service');
const CommandReader = require('./command-reader');
const HistoryStore = require('./history-store');
const ProcessRunner = require('./process-runner');
const RunCommand = require('./run-command');

class AppIntegratorFactory {

    constructor() {
        this._cache = {};
    }

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
            commandReader: new CommandReader({
                vsWindow: vscode.window,
                historyStore: this._historyStore
            }),
            historyStore: this._historyStore,
            shellCommandService: this._shellCommandService,
            showErrorMessage: message => vscode.window.showErrorMessage(message)
        });
    }

    get _historyStore() {
        this._cache.historyStore = this._cache.historyStore || new HistoryStore();
        return this._cache.historyStore;
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
