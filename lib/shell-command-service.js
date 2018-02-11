
class ShellCommandService {

    constructor(params) {
        this._childProcess = params.childProcess;
        this._processRunner = params.processRunner;
        this._shellCommandExecContext = params.shellCommandExecContext;
        this._shellProgrammeResolver = params.shellProgrammeResolver;
        this._shellArgsRetriever = params.shellArgsRetriever;
    }

    runCommand(params) {
        const options = this._getOptions(params.filePath);
        const shell = this._shellProgrammeResolver.resolve();
        const shellArgs = this._shellArgsRetriever.retrieve();
        const command = this._childProcess.spawn(shell, [shellArgs, params.command], options);
        return this._processRunner.run(command, params.input);
    }

    _getOptions(filePath) {
        return {
            cwd: this._shellCommandExecContext.getCwd(filePath),
            env: this._shellCommandExecContext.env
        };
    }

}

module.exports = ShellCommandService;
