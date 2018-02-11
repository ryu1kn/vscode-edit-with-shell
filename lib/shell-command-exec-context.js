
const Const = require('./const');
const path = require('path');

const CurrentDirectoryKind = {
    CURRENT_FILE: 'currentFile',
    WORKSPACE_ROOT: 'workspaceRoot'
};

class ShellCommandExecContext {

    constructor(params) {
        this._process = params.process;
        this._workspaceAdapter = params.workspaceAdapter;
    }

    get env() {
        return this._process.env;
    }

    getCwd(filePath) {
        const configPath = `${Const.EXTENSION_NAME}.currentDirectoryKind`;
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

module.exports = ShellCommandExecContext;
