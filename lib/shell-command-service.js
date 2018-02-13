
const ProcessBuilder = require('./process-builder');

class ShellCommandService {

    constructor(params) {
        this._commandBuilder = new ProcessBuilder({
            childProcess: params.childProcess,
            shellCommandExecContext: params.shellCommandExecContext,
            shellProgrammeResolver: params.shellProgrammeResolver,
            shellArgsRetriever: params.shellArgsRetriever
        });
        this._processRunner = params.processRunner;
    }

    runCommand(params) {
        const command = this._commandBuilder.build(params);
        return this._processRunner.run(command, params.input);
    }

}

module.exports = ShellCommandService;
