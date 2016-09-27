
'use strict';

class CommandRunner {

    constructor(params) {
        this._childProcess = params.childProcess;
    }

    run(command, input) {
        const commandString = this._getCommandString(command);
        const options = this._getOptions(input);
        return new Promise((resolve, reject) => {
            this._childProcess.exec(commandString, options, (err, stdout, stderr) => {
                if (err) reject(err);
                else resolve(stdout);
            });
        }).then(output => this._trimLastNewline(output));
    }

    _getCommandString(command) {
        return `echo "$CR_SELECTION" | ${command}`;
    }

    _getOptions(commandInput) {
        return {
            env: {CR_SELECTION: commandInput}
        };
    }

    _trimLastNewline(commandOutput) {
        return commandOutput.slice(-1) === '\n' ? commandOutput.slice(0, -1) : commandOutput;
    }

}

module.exports = CommandRunner;
