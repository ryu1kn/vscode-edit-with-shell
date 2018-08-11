import AppIntegrator from './app-integrator';
import Editor from './adapters/editor';
import ShellCommandService from './shell-command-service';
import ShellCommandExecContext from './shell-command-exec-context';
import ShellProgrammeResolver from './shell-programme-resolver';
import ShellArgsRetriever from './shell-args-retriever';
import CommandReader from './command-reader';
import HistoryStore from './history-store';
import ProcessRunner from './process-runner';
import RunCommand from './commands/run';
import ClearHistoryCommand from './commands/clear-history';
import WorkspaceAdapter from './adapters/workspace';
import * as vscode from 'vscode';

const childProcess = require('child_process');

export default class AppIntegratorFactory {
    private _cache: {
        workspaceAdapter?: WorkspaceAdapter;
        historyStore?: HistoryStore;
    };

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
            wrapEditor: editor => new Editor(editor, this._locationFactory),
            workspaceAdapter: this._workspaceAdapter
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

    get _locationFactory() {
        return {
            createPosition: (line, character) => new vscode.Position(line, character),
            createRange: (p1, p2) => new vscode.Range(p1, p2)
        };
    }

    get _workspaceAdapter() {
        this._cache.workspaceAdapter = this._cache.workspaceAdapter ||
            new WorkspaceAdapter({vsWorkspace: vscode.workspace});
        return this._cache.workspaceAdapter;
    }

}
