import {EXTENSION_NAME} from './const';
import Workspace from './adapters/workspace';
import {EnvVarWrap} from './types/node';
import {dirname} from 'path';

enum CurrentDirectoryKind {
    CURRENT_FILE = 'currentFile',
    WORKSPACE_ROOT = 'workspaceRoot'
}

export default class ShellCommandExecContext {
    private readonly workspaceAdapter: Workspace;
    private readonly process: EnvVarWrap;

    constructor(workspaceAdapter: Workspace, process: EnvVarWrap) {
        this.process = process;
        this.workspaceAdapter = workspaceAdapter;
    }

    get env() {
        return this.process.env;
    }

    getCwd(filePath?: string) {
        const configPath = `${EXTENSION_NAME}.currentDirectoryKind`;
        const currentDirectoryKind = this.workspaceAdapter.getConfig(configPath) as CurrentDirectoryKind;
        switch (currentDirectoryKind) {
        case CurrentDirectoryKind.CURRENT_FILE:
            return filePath ? dirname(filePath) : this.env.HOME;

        case CurrentDirectoryKind.WORKSPACE_ROOT:
            return this.workspaceAdapter.rootPath || this.env.HOME;

        default:
            throw new Error(`Unknown currentDirectoryKind: ${currentDirectoryKind}`);
        }
    }

}
