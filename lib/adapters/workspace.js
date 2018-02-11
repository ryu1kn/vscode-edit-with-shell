
class Workspace {

    constructor({vsWorkspace}) {
        this._vsWorkspace = vsWorkspace;
    }

    getConfig(configPath) {
        const configPathParts = configPath.split('.');
        const parentPath = configPathParts.slice(0, -1).join('.');
        const childName = configPathParts.slice(-1)[0];
        return this._vsWorkspace.getConfiguration(parentPath).get(childName);
    }

}

module.exports = Workspace;
