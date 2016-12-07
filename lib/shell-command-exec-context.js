
const Const = require('./const');
const path = require('path');

const CurrentDirectoryKind = {
    CURRENT_FILE: 'currentFile',
    WORKSPACE_ROOT: 'workspaceRoot'
};

class ShellCommandExecContext {

    constructor(params) {
        this._process = params.process;
        this._vsWorkspace = params.vsWorkspace;
    }

    get env() {
        return this._process.env;
    }

    getCwd(filePath) {
        const currentDirectoryKind = this._getExtensionConfig('currentDirectoryKind');
        switch (currentDirectoryKind) {
        case CurrentDirectoryKind.CURRENT_FILE:
            return filePath ? path.dirname(filePath) : this.env.HOME;

        case CurrentDirectoryKind.WORKSPACE_ROOT:
            return this._vsWorkspace.rootPath || this.env.HOME;

        default:
            throw new Error(`Unknown currentDirectoryKind: ${currentDirectoryKind}`);
        }
    }

    _getExtensionConfig(configName) {
        const config = this._vsWorkspace.getConfiguration(Const.EXTENSION_NAME);
        return config.get(configName);
    }

}

module.exports = ShellCommandExecContext;
