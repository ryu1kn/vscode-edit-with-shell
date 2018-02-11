
class ShellCommandService {

    constructor(params) {
        this._childProcess = params.childProcess;
        this._processRunner = params.processRunner;
        this._shellCommandExecContext = params.shellCommandExecContext;
        this._shellPathResolver = params.shellPathResolver;
        this._shellArgsResolver = params.shellArgsResolver;
    }

    runCommand(params) {
        const options = this._getOptions(params.filePath);
        const shell = this._shellPathResolver.resolve();
        const shellArgs = this._shellArgsResolver.resolve();
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
