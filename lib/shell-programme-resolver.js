
const {EXTENSION_NAME} = require('./const');
const resolveOsKind = require('./resolve-os-kind');

class ShellProgrammeResolver {

    constructor(params) {
        this._workspaceAdapter = params.workspaceAdapter;
        this._platform = params.platform;
    }

    resolve() {
        const osKind = resolveOsKind(this._platform);
        return this._workspaceAdapter.getConfig(`${EXTENSION_NAME}.shell.${osKind}`);
    }

}

module.exports = ShellProgrammeResolver;
