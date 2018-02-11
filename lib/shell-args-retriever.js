
const {EXTENSION_NAME} = require('./const');
const resolveOsKind = require('./resolve-os-kind');

class ShellArgsRetriever {

    constructor(params) {
        this._workspaceAdapter = params.workspaceAdapter;
        this._platform = params.platform;
    }

    retrieve() {
        const osKind = resolveOsKind(this._platform);
        return this._workspaceAdapter.getConfig(`${EXTENSION_NAME}.shellArgs.${osKind}`);
    }

}

module.exports = ShellArgsRetriever;
