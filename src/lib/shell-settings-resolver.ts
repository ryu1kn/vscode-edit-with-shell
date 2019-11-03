import {EXTENSION_NAME} from './const';
import resolveOsKind from './resolve-os-kind';
import Workspace from './adapters/workspace';

export default class ShellSettingsResolver {
    constructor(private readonly workspaceAdapter: Workspace,
                private readonly platform: string) {}

    shellProgramme(): string {
        return this.workspaceAdapter.getConfig<string>(`${EXTENSION_NAME}.shell.${this.osKind}`);
    }

    shellArgs(): string[] {
        return this.workspaceAdapter.getConfig<string[]>(`${EXTENSION_NAME}.shellArgs.${this.osKind}`);
    }

    private get osKind() {
        return resolveOsKind(this.platform);
    }
}
