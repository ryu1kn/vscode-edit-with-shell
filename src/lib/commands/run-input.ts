import {ShellCommandService} from '../shell-command-service';
import CommandReader from '../command-reader';
import {HistoryStore} from '../history-store';
import Workspace from '../adapters/workspace';
import {RunCommand} from './run';

export default class RunInputCommand extends RunCommand {
    constructor(shellCommandService: ShellCommandService,
                private readonly commandReader: CommandReader,
                historyStore: HistoryStore,
                workspaceAdapter: Workspace) {
        super(shellCommandService, historyStore, workspaceAdapter);
    }

    protected getCommandText(): Promise<string|undefined> {
        return this.commandReader.read();
    }
}
