import {EXTENSION_NAME} from '../const';
import ShellCommandService from '../shell-command-service';
import CommandReader from '../command-reader';
import HistoryStore from '../history-store';
import Workspace from '../adapters/workspace';
import Editor from '../adapters/editor';
import {ExtensionCommand} from './extension-command';

export default class RunCommand implements ExtensionCommand {
    private readonly shellCommandService: ShellCommandService;
    private readonly commandReader: CommandReader;
    private readonly historyStore: HistoryStore;
    private readonly workspaceAdapter: Workspace;

    constructor(shellCommandService: ShellCommandService,
                commandReader: CommandReader,
                historyStore: HistoryStore,
                workspaceAdapter: Workspace) {
        this.shellCommandService = shellCommandService;
        this.commandReader = commandReader;
        this.historyStore = historyStore;
        this.workspaceAdapter = workspaceAdapter;
    }

    async execute(wrappedEditor: Editor) {
        const command = await this.commandReader.read();
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

    private shouldPassEntireText(wrappedEditor: Editor) {
        const processEntireText = this.workspaceAdapter.getConfig(`${EXTENSION_NAME}.processEntireTextIfNoneSelected`);
        return !wrappedEditor.isTextSelected && processEntireText;
    }
}
