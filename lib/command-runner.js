
'use strict';

class CommandRunner {

    constructor(params) {
        this._childProcess = params.childProcess;
        this._getEnvVars = params.getEnvVars;
    }

    run(command, input) {
        const commandString = this._getCommandString(command, !!input);
        const options = this._getOptions(input);
        return new Promise((resolve, reject) => {
            this._childProcess.exec(commandString, options, (err, stdout, stderr) => {
                if (err) reject(err);
                else resolve(stdout);
            });
        });
    }

    _getCommandString(command, existsInput) {
        return !existsInput ? command : `printf "$CR_SELECTION" | ${command}`;
    }

    _getOptions(commandInput) {
        const commandInputEnv = commandInput ? {CR_SELECTION: commandInput} : null;
        return {
            env: Object.assign({}, this._getEnvVars(), commandInputEnv)
        };
    }

}

module.exports = CommandRunner;
