
class ShellCommandService {

    constructor(params) {
        this._processBuilderProvider = params.processBuilderProvider;
        this._processRunner = params.processRunner;
    }

    runCommand(params) {
        const processBuilder = this._processBuilderProvider.provide();
        const command = processBuilder.build(params);
        return this._processRunner.run(command, params.input);
    }

}

module.exports = ShellCommandService;
