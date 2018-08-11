import {EXTENSION_NAME} from './const';
import resolveOsKind from './resolve-os-kind';
import Workspace from './adapters/workspace';

export default class ShellProgrammeResolver {
    private readonly workspaceAdapter: Workspace;
    private readonly platform: string;

    constructor(workspaceAdapter: Workspace, platform: string) {
        this.workspaceAdapter = workspaceAdapter;
        this.platform = platform;
    }

    resolve(): string {
        const osKind = resolveOsKind(this.platform);
        return this.workspaceAdapter.getConfig(`${EXTENSION_NAME}.shell.${osKind}`) as string;
    }

}
