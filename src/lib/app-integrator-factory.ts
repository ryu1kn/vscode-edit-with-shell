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
    private readonly cache: {
        workspaceAdapter?: WorkspaceAdapter;
        historyStore?: HistoryStore;
    };

    constructor() {
        this.cache = {};
    }

    create() {
        return new AppIntegrator(this._runCommand, this.clearHistoryCommand, vscode);
    }

    private get _runCommand() {
        return new RunCommand(
            this.shellCommandService,
            new CommandReader(this.historyStore, vscode.window),
            this.historyStore,
            (editor: VsTextEditor) => new Editor(editor, this.locationFactory),
            this.workspaceAdapter,
            (message: string) => vscode.window.showErrorMessage(message),
            console
        );
    }

    private get clearHistoryCommand() {
        return new ClearHistoryCommand(
            this.historyStore,
            (message: string) => vscode.window.showErrorMessage(message),
            console
        );
    }

    private get historyStore() {
        this.cache.historyStore = this.cache.historyStore || new HistoryStore();
        return this.cache.historyStore;
    }

    private get shellCommandService() {
        const workspaceAdapter = this.workspaceAdapter;
        return new ShellCommandService(
            new ProcessRunner(),
            new ShellProgrammeResolver(workspaceAdapter, process.platform),
            new ShellArgsRetriever(workspaceAdapter, process.platform),
            new ShellCommandExecContext(workspaceAdapter, process as EnvVars),
            childProcess
        );
    }

    private get locationFactory() {
        return {
            createPosition: (line: number, character: number) => new Position(line, character),
            createRange: (p1: Position, p2: Position) => new Range(p1, p2)
        };
    }

    private get workspaceAdapter() {
        this.cache.workspaceAdapter = this.cache.workspaceAdapter ||
            new WorkspaceAdapter(vscode.workspace);
        return this.cache.workspaceAdapter;
    }

}
