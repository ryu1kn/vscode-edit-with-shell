import {EXTENSION_NAME} from './const';
import resolveOsKind from './resolve-os-kind';
import Workspace from './adapters/workspace';

export default class ShellArgsRetriever {
    private _workspaceAdapter: Workspace;
    private _platform: string;

    constructor(workspaceAdapter: Workspace, platform: string) {
        this._workspaceAdapter = workspaceAdapter;
        this._platform = platform;
    }

    retrieve(): string[] {
        const osKind = resolveOsKind(this._platform);
        return this._workspaceAdapter.getConfig(`${EXTENSION_NAME}.shellArgs.${osKind}`) as string[];
    }

}
