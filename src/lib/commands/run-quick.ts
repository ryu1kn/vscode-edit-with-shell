import {EXTENSION_NAME} from '../const';
import ShellCommandService from '../shell-command-service';
import HistoryStore from '../history-store';
import Workspace from '../adapters/workspace';
import Editor from '../adapters/editor';
import {ExtensionCommand} from './extension-command';

interface FavoriteCommand {
    id: string;
    command: string;
}

export default class RunQuickCommand implements ExtensionCommand {
    private readonly shellCommandService: ShellCommandService;
    private readonly historyStore: HistoryStore;
    private readonly workspaceAdapter: Workspace;

    constructor(shellCommandService: ShellCommandService,
                historyStore: HistoryStore,
                workspaceAdapter: Workspace) {
        this.shellCommandService = shellCommandService;
        this.historyStore = historyStore;
        this.workspaceAdapter = workspaceAdapter;
    }

    async execute(wrappedEditor: Editor) {
        const commandId = this.workspaceAdapter.getConfig<string>(`${EXTENSION_NAME}.quickCommand1`);
        const favoriteCommands = this.workspaceAdapter.getConfig<FavoriteCommand[]>(`${EXTENSION_NAME}.favoriteCommands`);
        const command = favoriteCommands.find(c => c.id === commandId);
        if (!command) return;

        const commandText= command.command;

        this.historyStore.add(commandText);

        if (this.shouldPassEntireText(wrappedEditor)) {
            await this.processEntireText(commandText, wrappedEditor);
        } else {
            await this.processSelectedText(commandText, wrappedEditor);
        }
    }

    private async processSelectedText(command: string, wrappedEditor: Editor): Promise<void> {
        const commandOutput = await this.shellCommandService.runCommand({
            command,
            input: wrappedEditor.selectedText,
            filePath: wrappedEditor.filePath
        });
        await wrappedEditor.replaceSelectedTextWith(commandOutput);
    }

    private async processEntireText(command: string, wrappedEditor: Editor): Promise<void> {
        const commandOutput = await this.shellCommandService.runCommand({
            command,
            input: wrappedEditor.entireText,
            filePath: wrappedEditor.filePath
        });
        await wrappedEditor.replaceEntireTextWith(commandOutput);
    }

    private shouldPassEntireText(wrappedEditor: Editor): boolean {
        const processEntireText = this.workspaceAdapter.getConfig<boolean>(`${EXTENSION_NAME}.processEntireTextIfNoneSelected`);
        return !wrappedEditor.isTextSelected && processEntireText;
    }
}
