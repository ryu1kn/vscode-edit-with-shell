
class DefaultProcessBuilder {

    constructor(params) {
        this._childProcess = params.childProcess;
        this._shellCommandExecContext = params.shellCommandExecContext;
    }

    build(params) {
        const options = this._getOptions(params.filePath);
        return this._childProcess.spawn(params.command, options);
    }

    _getOptions(filePath) {
        return {
            shell: true,
            cwd: this._shellCommandExecContext.getCwd(filePath),
            env: this._shellCommandExecContext.env
        };
    }

}

module.exports = DefaultProcessBuilder;
