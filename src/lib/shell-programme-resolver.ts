import {EXTENSION_NAME} from './const';
import resolveOsKind from './resolve-os-kind';
import Workspace from './adapters/workspace';

export default class ShellProgrammeResolver {
    private readonly _workspaceAdapter: Workspace;
    private readonly _platform: string;

    constructor(workspaceAdapter: Workspace, platform: string) {
        this._workspaceAdapter = workspaceAdapter;
        this._platform = platform;
    }

    resolve(): string {
        const osKind = resolveOsKind(this._platform);
        return this._workspaceAdapter.getConfig(`${EXTENSION_NAME}.shell.${osKind}`) as string;
    }

}
