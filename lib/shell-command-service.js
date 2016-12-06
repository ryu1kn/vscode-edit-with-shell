
class ShellCommandService {

    constructor(params) {
        this._childProcess = params.childProcess;
        this._processRunner = params.processRunner;
        this._shellCommandExecContext = params.shellCommandExecContext;
    }

    runCommand(commandString, input) {
        const options = this._getOptions();
        const command = this._childProcess.spawn(commandString, options);
        return this._processRunner.run(command, input);
    }

    _getOptions() {
        return {
            shell: true,
            cwd: this._shellCommandExecContext.cwd,
            env: this._shellCommandExecContext.env
        };
    }

}

module.exports = ShellCommandService;
