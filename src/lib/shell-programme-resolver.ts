import {EXTENSION_NAME} from './const';
import resolveOsKind from './resolve-os-kind';
import Workspace from './adapters/workspace';

export default class ShellProgrammeResolver {
    private _workspaceAdapter: Workspace;
    private _platform: any;

    constructor(params) {
        this._workspaceAdapter = params.workspaceAdapter;
        this._platform = params.platform;
    }

    resolve() {
        const osKind = resolveOsKind(this._platform);
        return this._workspaceAdapter.getConfig(`${EXTENSION_NAME}.shell.${osKind}`);
    }

}
