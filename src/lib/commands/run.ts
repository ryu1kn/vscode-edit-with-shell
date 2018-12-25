import {EXTENSION_NAME} from '../const';
import ShellCommandService from '../shell-command-service';
import HistoryStore from '../history-store';
import Workspace from '../adapters/workspace';
import Editor from '../adapters/editor';
import {ExtensionCommand} from './extension-command';

export abstract class RunCommand implements ExtensionCommand {
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

    protected abstract getCommandText(): Promise<string|undefined>;

    async execute(wrappedEditor: Editor) {
        const command = await this.getCommandText();
        if (!command) return;

        this.historyStore.add(command);

        if (this.shouldPassEntireText(wrappedEditor)) {
            await this.processEntireText(command, wrappedEditor);
        } else {
            await this.processSelectedText(command, wrappedEditor);
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
