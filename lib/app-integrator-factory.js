
const childProcess = require('child_process');
const vscode = require('vscode');

const AppIntegrator = require('./app-integrator');
const Editor = require('./adapters/editor');
const ShellCommandService = require('./shell-command-service');
const ShellCommandExecContext = require('./shell-command-exec-context');
const ShellProgrammeResolver = require('./shell-programme-resolver');
const ShellArgsRetriever = require('./shell-args-retriever');
const CommandReader = require('./command-reader');
const HistoryStore = require('./history-store');
const ProcessRunner = require('./process-runner');
const RunCommand = require('./commands/run');
const ClearHistoryCommand = require('./commands/clear-history');
const WorkspaceAdapter = require('./adapters/workspace');

class AppIntegratorFactory {

    constructor() {
        this._cache = {};
    }

    create() {
        return new AppIntegrator({
            vscode,
            runCommand: this._runCommand,
            clearHistoryCommand: this._clearHistoryCommand
        });
    }

    get _runCommand() {
        return new RunCommand({
            logger: console,
            commandReader: new CommandReader({
                vsWindow: vscode.window,
                historyStore: this._historyStore
            }),
            historyStore: this._historyStore,
            shellCommandService: this._shellCommandService,
            showErrorMessage: message => vscode.window.showErrorMessage(message),
            wrapEditor: editor => new Editor(editor)
        });
    }

    get _clearHistoryCommand() {
        return new ClearHistoryCommand({
            logger: console,
            historyStore: this._historyStore,
            showErrorMessage: message => vscode.window.showErrorMessage(message)
        });
    }

    get _historyStore() {
        this._cache.historyStore = this._cache.historyStore || new HistoryStore();
        return this._cache.historyStore;
    }

    get _shellCommandService() {
        const workspaceAdapter = this._workspaceAdapter;
        return new ShellCommandService({
            childProcess,
            processRunner: new ProcessRunner(),
            shellCommandExecContext: new ShellCommandExecContext({process, workspaceAdapter}),
            shellProgrammeResolver: new ShellProgrammeResolver({
                platform: process.platform,
                workspaceAdapter
            }),
            shellArgsRetriever: new ShellArgsRetriever({
                platform: process.platform,
                workspaceAdapter
            })
        });
    }

    get _workspaceAdapter() {
        return new WorkspaceAdapter({vsWorkspace: vscode.workspace});
    }

}

module.exports = AppIntegratorFactory;
