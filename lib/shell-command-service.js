
class ShellCommandService {

    constructor(params) {
        this._processBuilder = params.processBuilder;
        this._processRunner = params.processRunner;
    }

    runCommand(params) {
        const command = this._processBuilder.build(params);
        return this._processRunner.run(command, params.input);
    }

}

module.exports = ShellCommandService;
