
const OS_KIND = {
    darwin: 'osx',
    linux: 'linux',
    win32: 'windows'
};
const DEFAULT_OS_KIND = OS_KIND.linux;

class ShellPathResolver {

    constructor(params) {
        this._workspaceAdapter = params.workspaceAdapter;
        this._platform = params.platform;
    }

    resolve() {
        return this._workspaceAdapter.getConfig(`terminal.integrated.shell.${this._findOsKind()}`);
    }

    _findOsKind() {
        return OS_KIND[this._platform] || DEFAULT_OS_KIND;
    }

}

module.exports = ShellPathResolver;
