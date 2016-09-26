
'use strict';

const vscode = require('vscode');

const AppIntegrator = require('./app-integrator');
const RunCommand = require('./command/run');

class AppIntegratorFactory {

    create() {
        const logger = console;
        const runCommand = new RunCommand({logger});
        return new AppIntegrator({
            vscode, runCommand
        });
    }
}

module.exports = AppIntegratorFactory;
