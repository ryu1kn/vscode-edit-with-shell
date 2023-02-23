import {EXTENSION_NAME} from './const';
import {Workspace} from './adapters/workspace';

interface FavoriteCommand {
    id: string;
    command: string;
    processEntireTextIfNoneSelected: boolean;
}

export class HistoryStore {
    private history: string[];

    constructor(private readonly workspaceAdapter: Workspace) {
        this.workspaceAdapter = workspaceAdapter;
        const favoriteCommands = this.workspaceAdapter.getConfig<FavoriteCommand[]>(`${EXTENSION_NAME}.favoriteCommands`);
        this.history = favoriteCommands.filter(o => o.command).map(o => o.command).sort().reverse();
    }

    getAll() {
        return this.history;
    }

    clear() {
        this.history = [];
    }

    add(command: string) {
        const history = this.history;
        const index = history.indexOf(command);
        if (index === -1) {
            this.history = [...history, command];
            return;
        }
        this.history = [...history.slice(0, index), ...history.slice(index + 1), command];
    }

}
