import * as vscode from 'vscode';

const CONFIG_PATH_DELIMITER = '.';

export default class Workspace {
    private _vsWorkspace: typeof vscode.workspace;

    constructor(vsWorkspace: typeof vscode.workspace) {
        this._vsWorkspace = vsWorkspace;
    }

    getConfig(configPath: string) {
        const {basePath, leafName} = this._parseConfigPath(configPath);
        return this._vsWorkspace.getConfiguration(basePath).get(leafName);
    }

    _parseConfigPath(configPath: string) {
        const configPathParts = configPath.split(CONFIG_PATH_DELIMITER);
        return {
            basePath: configPathParts.slice(0, -1).join(CONFIG_PATH_DELIMITER),
            leafName: configPathParts.slice(-1)[0]
        };
    }

    get rootPath() {
        return this._vsWorkspace.rootPath;
    }

}
