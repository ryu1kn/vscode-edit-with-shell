import {EXTENSION_NAME} from './const';
import Workspace from './adapters/workspace';
import {EnvVars} from './types/env-vars';

const path = require('path');

const CurrentDirectoryKind = {
    CURRENT_FILE: 'currentFile',
    WORKSPACE_ROOT: 'workspaceRoot'
};

export default class ShellCommandExecContext {
    private _workspaceAdapter: Workspace;
    private _process: EnvVars;

    constructor(params: any) {
        this._process = params.process;
        this._workspaceAdapter = params.workspaceAdapter;
    }

    get env() {
        return this._process.env;
    }

    getCwd(filePath?: string) {
        const configPath = `${EXTENSION_NAME}.currentDirectoryKind`;
        const currentDirectoryKind = this._workspaceAdapter.getConfig(configPath);
        switch (currentDirectoryKind) {
        case CurrentDirectoryKind.CURRENT_FILE:
            return filePath ? path.dirname(filePath) : this.env.HOME;

        case CurrentDirectoryKind.WORKSPACE_ROOT:
            return this._workspaceAdapter.rootPath || this.env.HOME;

        default:
            throw new Error(`Unknown currentDirectoryKind: ${currentDirectoryKind}`);
        }
    }

}
