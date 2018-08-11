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
import {Position, Range, TextEditor as VsTextEditor} from 'vscode';
import {EnvVars} from './types/env-vars';

const childProcess = require('child_process');

export default class AppIntegratorFactory {
    private readonly _cache: {
        workspaceAdapter?: WorkspaceAdapter;
        historyStore?: HistoryStore;
    };

    constructor() {
        this._cache = {};
    }

    create() {
        return new AppIntegrator(this._runCommand, this._clearHistoryCommand, vscode);
    }

    get _runCommand() {
        return new RunCommand(
            this._shellCommandService,
            new CommandReader(this._historyStore, vscode.window),
            this._historyStore,
            (editor: VsTextEditor) => new Editor(editor, this._locationFactory),
            this._workspaceAdapter,
            (message: string) => vscode.window.showErrorMessage(message),
            console
        );
    }

    get _clearHistoryCommand() {
        return new ClearHistoryCommand(
            this._historyStore,
            (message: string) => vscode.window.showErrorMessage(message),
            console
        );
    }

    get _historyStore() {
        this._cache.historyStore = this._cache.historyStore || new HistoryStore();
        return this._cache.historyStore;
    }

    get _shellCommandService() {
        const workspaceAdapter = this._workspaceAdapter;
        return new ShellCommandService(
            new ProcessRunner(),
            new ShellProgrammeResolver(workspaceAdapter, process.platform),
            new ShellArgsRetriever(workspaceAdapter, process.platform),
            new ShellCommandExecContext(workspaceAdapter, process as EnvVars),
            childProcess
        );
    }

    get _locationFactory() {
        return {
            createPosition: (line: number, character: number) => new Position(line, character),
            createRange: (p1: Position, p2: Position) => new Range(p1, p2)
        };
    }

    get _workspaceAdapter() {
        this._cache.workspaceAdapter = this._cache.workspaceAdapter ||
            new WorkspaceAdapter(vscode.workspace);
        return this._cache.workspaceAdapter;
    }

}
