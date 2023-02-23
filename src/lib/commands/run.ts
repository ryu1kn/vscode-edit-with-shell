import {EXTENSION_NAME} from '../const';
import {ShellCommandService} from '../shell-command-service';
import {HistoryStore} from '../history-store';
import {Workspace} from '../adapters/workspace';
import {Editor} from '../adapters/editor';
import {ExtensionCommand} from './extension-command';

interface FavoriteCommand {
    id: string;
    command: string;
    processEntireTextIfNoneSelected: boolean;
}

export abstract class RunCommand implements ExtensionCommand {
    constructor(private readonly shellCommandService: ShellCommandService,
                private readonly historyStore: HistoryStore,
                private readonly workspaceAdapter: Workspace) {}

    protected abstract getCommandText(): Promise<string|undefined>;

    async execute(wrappedEditor: Editor) {
        const command = await this.getCommandText();
        if (!command) return;

        this.historyStore.add(command);

        if (this.shouldPassEntireText(wrappedEditor, command)) {
            await this.processEntireText(command, wrappedEditor);
        } else {
            await this.processSelectedTexts(command, wrappedEditor);
        }
    }

    private async processSelectedTexts(command: string, wrappedEditor: Editor): Promise<void> {
        const filePath = wrappedEditor.filePath;
        const promiseOfCommandOutputs = wrappedEditor.selectedTexts
            .map(input => this.shellCommandService.runCommand({command, input, filePath}));
        const commandOutputs = await Promise.all(promiseOfCommandOutputs);
        await wrappedEditor.replaceSelectedTextsWith(commandOutputs);
    }

    private async processEntireText(command: string, wrappedEditor: Editor): Promise<void> {
        const commandOutput = await this.shellCommandService.runCommand({
            command,
            input: wrappedEditor.entireText,
            filePath: wrappedEditor.filePath
        });
        await wrappedEditor.replaceEntireTextWith(commandOutput);
    }

    private shouldPassEntireText(wrappedEditor: Editor, command: string): boolean {
        const processEntireText = this.workspaceAdapter.getConfig<boolean>(`${EXTENSION_NAME}.processEntireTextIfNoneSelected`);
        
        const favoriteCommands = this.workspaceAdapter.getConfig<FavoriteCommand[]>(`${EXTENSION_NAME}.favoriteCommands`);
        const commandData = favoriteCommands.find(c => c.command === command);
        const commandProcessEntireText = (commandData && typeof commandData.processEntireTextIfNoneSelected === 'boolean')
            ? commandData.processEntireTextIfNoneSelected
            : processEntireText;
        
        return !wrappedEditor.isTextSelected && commandProcessEntireText;
    }
}
