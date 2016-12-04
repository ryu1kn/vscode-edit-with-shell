
class ShellCommandService {

    constructor(params) {
        this._childProcess = params.childProcess;
        this._processRunner = params.processRunner;
        this._getEnvVars = params.getEnvVars;
    }

    runCommand(commandString, input) {
        const options = this._getOptions();
        const command = this._childProcess.spawn(commandString, options);
        return this._processRunner.run(command, input);
    }

    _getOptions() {
        return {
            shell: true,
            env: this._getEnvVars()
        };
    }

}

module.exports = ShellCommandService;
