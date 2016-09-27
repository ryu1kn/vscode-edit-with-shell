
'use strict';

class CommandRunner {

    constructor(params) {
        this._childProcess = params.childProcess;
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
        if (!commandInput) return {};
        return {
            env: {CR_SELECTION: commandInput}
        };
    }

}

module.exports = CommandRunner;
