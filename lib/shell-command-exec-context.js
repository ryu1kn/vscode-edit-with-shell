
class ShellCommandExecContext {

    constructor(params) {
        this._process = params.process;
        this._vsWorkspace = params.vsWorkspace;
    }

    get env() {
        return this._process.env;
    }

    get cwd() {
        if (this._vsWorkspace.rootPath) return this._vsWorkspace.rootPath;
        return this.env.HOME;
    }

}

module.exports = ShellCommandExecContext;
