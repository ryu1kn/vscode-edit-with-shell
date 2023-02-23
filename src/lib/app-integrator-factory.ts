import {AppIntegrator} from './app-integrator';
import {Editor} from './adapters/editor';
import {ShellCommandService} from './shell-command-service';
import {CommandReader} from './command-reader';
import {HistoryStore} from './history-store';
import {ProcessRunner} from './process-runner';
import {RunInputCommand} from './commands/run-input';
import {ClearHistoryCommand} from './commands/clear-history';
import {Workspace as WorkspaceAdapter} from './adapters/workspace';
import * as vscode from 'vscode';
import {Position, Range, TextEditor as VsTextEditor} from 'vscode';
import {ExtensionCommand} from './commands/extension-command';
import {CommandWrap} from './command-wrap';
import {RunQuickCommand} from './commands/run-quick';

const childProcess = require('child_process');

export class AppIntegratorFactory {
    private readonly cache: {
        workspaceAdapter?: WorkspaceAdapter;
        historyStore?: HistoryStore;
    };

    constructor() {
        this.cache = Object.create(null);
    }

    create() {
        return new AppIntegrator(this.runCommand, this.clearHistoryCommand, this.createQuickCommand, vscode);
    }

    private get runCommand() {
        return this.wrapCommand(new RunInputCommand(
            this.shellCommandService,
            new CommandReader(this.historyStore, vscode.window, this.workspaceAdapter),
            this.historyStore,
            this.workspaceAdapter
        ));
    }

    private get createQuickCommand() {
        return (commandNumber: number) => this.wrapCommand(new RunQuickCommand(
            this.shellCommandService,
            this.historyStore,
            this.workspaceAdapter,
            commandNumber
        ));
    }

    private get clearHistoryCommand() {
        return this.wrapCommand(new ClearHistoryCommand(this.historyStore));
    }

    private wrapCommand(command: ExtensionCommand) {
        return new CommandWrap(
            command,
            (editor: VsTextEditor) => new Editor(editor, this.locationFactory),
            (message: string) => vscode.window.showErrorMessage(message),
            console
        );
    }

    private get historyStore() {
        this.cache.historyStore = this.cache.historyStore || new HistoryStore(this.workspaceAdapter);
        return this.cache.historyStore;
    }

    private get shellCommandService() {
        return new ShellCommandService(
            new ProcessRunner(),
            this.workspaceAdapter,
            process,
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
