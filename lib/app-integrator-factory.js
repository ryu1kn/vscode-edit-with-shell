
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
const ProcessBuilder = require('./process-builder');
const ProcessBuilderProvider = require('./process-builder-provider');
const ProcessRunner = require('./process-runner');
const RunCommand = require('./run-command');
const WorkspaceAdapter = require('./adapters/workspace');

class AppIntegratorFactory {

    constructor() {
        this._cache = Object.create(null);
    }

    create() {
        return new AppIntegrator({
            vscode,
            runCommand: this._runCommand
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

    get _historyStore() {
        this._cache.historyStore = this._cache.historyStore || new HistoryStore();
        return this._cache.historyStore;
    }

    get _shellCommandService() {
        return new ShellCommandService({
            processBuilderProvider: new ProcessBuilderProvider({
                customProcessBuilder: new ProcessBuilder({
                    childProcess,
                    shellCommandExecContext: this._shellCommandExecContext,
                    shellProgrammeResolver: this._shellProgrammeResolver,
                    shellArgsRetriever: new ShellArgsRetriever({
                        platform: process.platform,
                        workspaceAdapter: this._workspaceAdapter
                    })
                }),
                shellProgrammeResolver: this._shellProgrammeResolver
            }),
            processRunner: new ProcessRunner()
        });
    }

    get _shellCommandExecContext() {
        this._cache.shellCommandExecContext = this._cache.shellCommandExecContext ||
            new ShellCommandExecContext({
                process,
                workspaceAdapter: this._workspaceAdapter
            });
        return this._cache.shellCommandExecContext;
    }

    get _shellProgrammeResolver() {
        this._cache.shellProgrammeResolver = this._cache.shellProgrammeResolver ||
            new ShellProgrammeResolver({
                platform: process.platform,
                workspaceAdapter: this._workspaceAdapter
            });
        return this._cache.shellProgrammeResolver;
    }

    get _workspaceAdapter() {
        this._cache.workspaceAdapter = this._cache.workspaceAdapter ||
            new WorkspaceAdapter({vsWorkspace: vscode.workspace});
        return this._cache.workspaceAdapter;
    }

}

module.exports = AppIntegratorFactory;
