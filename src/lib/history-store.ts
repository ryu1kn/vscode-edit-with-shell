import {EXTENSION_NAME} from './const';
import {Workspace} from './adapters/workspace';

interface FavoriteCommand {
    id: string;
    command: string;
    processEntireTextIfNoneSelected: boolean;
}

export class HistoryStore {
    private favoriteCommands: string[];
    private history: string[];

    constructor(private readonly workspaceAdapter: Workspace) {
        this.workspaceAdapter = workspaceAdapter;
        const favoriteCommands = this.workspaceAdapter.getConfig<FavoriteCommand[]>(`${EXTENSION_NAME}.favoriteCommands`);
        this.favoriteCommands = favoriteCommands.filter(o => o.command).map(o => o.command).sort();
        this.favoriteCommands.unshift('-----Favorite commands');
        this.history = [];
    }

    getAll() {
        return this.history.reverse().concat(this.favoriteCommands);
    }

    clear() {
        const clearFavoriteCommands = this.workspaceAdapter.getConfig<boolean>(`${EXTENSION_NAME}.clearFavoriteCommands`);
        
        this.history = [];
        if (clearFavoriteCommands) {
            this.favoriteCommands = [];
        }
    }

    add(command: string) {
        this.history = this.history.filter(cmd => cmd !== command);
        this.history.unshift(command);
    }

}
