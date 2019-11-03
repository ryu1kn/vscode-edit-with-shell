import {EXTENSION_NAME} from '../const';
import {ShellCommandService} from '../shell-command-service';
import {HistoryStore} from '../history-store';
import Workspace from '../adapters/workspace';
import {RunCommand} from './run';

interface FavoriteCommand {
    id: string;
    command: string;
}

export default class RunQuickCommand extends RunCommand {
    constructor(shellCommandService: ShellCommandService,
                historyStore: HistoryStore,
                private readonly workspace: Workspace,
                private readonly commandNumber: number) {
        super(shellCommandService, historyStore, workspace);
    }

    protected getCommandText(): Promise<string|undefined> {
        const commandId = this.workspace.getConfig<string>(`${EXTENSION_NAME}.quickCommand${this.commandNumber}`);
        const favoriteCommands = this.workspace.getConfig<FavoriteCommand[]>(`${EXTENSION_NAME}.favoriteCommands`);
        const command = favoriteCommands.find(c => c.id === commandId);
        return Promise.resolve(command && command.command);
    }
}
