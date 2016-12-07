
class ShellCommandService {

    constructor(params) {
        this._childProcess = params.childProcess;
        this._processRunner = params.processRunner;
        this._shellCommandExecContext = params.shellCommandExecContext;
    }

    runCommand(params) {
        const options = this._getOptions(params.filePath);
        const command = this._childProcess.spawn(params.command, options);
        return this._processRunner.run(command, params.input);
    }

    _getOptions(filePath) {
        return {
            shell: true,
            cwd: this._shellCommandExecContext.getCwd(filePath),
            env: this._shellCommandExecContext.env
        };
    }

}

module.exports = ShellCommandService;
