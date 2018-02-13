
class ProcessBuilder {

    constructor(params) {
        this._childProcess = params.childProcess;
        this._shellCommandExecContext = params.shellCommandExecContext;
        this._shellProgrammeResolver = params.shellProgrammeResolver;
        this._shellArgsRetriever = params.shellArgsRetriever;
    }

    build(params) {
        const options = this._getOptions(params.filePath);
        const shell = this._shellProgrammeResolver.resolve();
        const shellArgs = this._shellArgsRetriever.retrieve();
        return this._childProcess.spawn(shell, [...shellArgs, params.command], options);
    }

    _getOptions(filePath) {
        return {
            cwd: this._shellCommandExecContext.getCwd(filePath),
            env: this._shellCommandExecContext.env
        };
    }

}

module.exports = ProcessBuilder;
