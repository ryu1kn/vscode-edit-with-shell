
const ShellCommandService = require('../../lib/shell-command-service');

describe('ShellCommandService', () => {

    it('runs a given command on shell', () => {
        const childProcess = {spawn: sinon.stub().returns('COMMAND')};
        const processRunner = {run: sinon.stub().returns(Promise.resolve('COMMAND_OUTPUT'))};
        const shellCommandExecContext = {getCwd: () => {}};
        const service = new ShellCommandService({childProcess, processRunner, shellCommandExecContext});
        const params = {command: 'COMMAND_STRING'};
        return service.runCommand(params).then(() => {
            const spawnArgs = childProcess.spawn.args[0];
            expect(spawnArgs[0]).to.eql('COMMAND_STRING');
            expect(spawnArgs[1]).to.include({shell: true});
            expect(processRunner.run).to.have.been.calledWith('COMMAND');
        });
    });

    it('passes selected text in the editor to the command', () => {
        const childProcess = {spawn: () => 'COMMAND'};
        const processRunner = {run: sinon.stub().returns(Promise.resolve('COMMAND_OUTPUT'))};
        const shellCommandExecContext = {getCwd: () => {}};
        const service = new ShellCommandService({childProcess, processRunner, shellCommandExecContext});
        const params = {
            command: 'COMMAND_STRING',
            input: 'SELECTED_TEXT'
        };
        return service.runCommand(params).then(output => {
            expect(output).to.eql('COMMAND_OUTPUT');
            expect(processRunner.run).to.have.been.calledWith('COMMAND', 'SELECTED_TEXT');
        });
    });

    it('collects the command output', () => {
        const childProcess = {spawn: () => 'COMMAND'};
        const processRunner = {run: () => Promise.resolve('COMMAND_OUTPUT')};
        const shellCommandExecContext = {getCwd: () => {}};
        const service = new ShellCommandService({childProcess, processRunner, shellCommandExecContext});
        const params = {command: 'COMMAND_STRING'};
        return service.runCommand(params).then(output => {
            expect(output).to.eql('COMMAND_OUTPUT');
        });
    });

    it('inherits environment variables on executing a command', () => {
        const childProcess = {spawn: sinon.stub().returns('COMMAND')};
        const processRunner = {run: () => Promise.resolve('COMMAND_OUTPUT')};
        const shellCommandExecContext = {
            env: {SOME_ENV_VAR: '...'},
            getCwd: () => {}
        };
        const service = new ShellCommandService({childProcess, processRunner, shellCommandExecContext});
        const params = {command: 'COMMAND_STRING'};
        return service.runCommand(params).then(() => {
            const spawnArgs = childProcess.spawn.args[0];
            expect(spawnArgs[1].env).to.eql({SOME_ENV_VAR: '...'});
        });
    });

    it('executes a command on a specific directory', () => {
        const childProcess = {spawn: sinon.stub().returns('COMMAND')};
        const processRunner = {run: () => Promise.resolve('COMMAND_OUTPUT')};
        const shellCommandExecContext = {
            env: {SOME_ENV_VAR: '...'},
            getCwd: stubWithArgs(['FILE_PATH'], 'COMMAND_EXEC_DIR')
        };
        const service = new ShellCommandService({childProcess, processRunner, shellCommandExecContext});
        const params = {
            command: 'COMMAND_STRING',
            filePath: 'FILE_PATH'
        };
        return service.runCommand(params).then(() => {
            const spawnArgs = childProcess.spawn.args[0];
            expect(spawnArgs[1].cwd).to.eql('COMMAND_EXEC_DIR');
        });
    });

    it('does not give an input to the command if no text is selected in the editor', () => {
        const childProcess = {spawn: () => 'COMMAND'};
        const processRunner = {run: sinon.stub().returns(Promise.resolve('COMMAND_OUTPUT'))};
        const shellCommandExecContext = {getCwd: () => {}};
        const service = new ShellCommandService({childProcess, processRunner, shellCommandExecContext});
        const params = {command: 'COMMAND_STRING'};
        return service.runCommand(params).then(output => {
            expect(output).to.eql('COMMAND_OUTPUT');
            expect(processRunner.run.args[0]).to.eql(['COMMAND', undefined]);
        });
    });

    it('throws an error if command failed', () => {
        const childProcess = {spawn: () => 'COMMAND'};
        const processRunner = {
            run: sinon.stub().returns(Promise.reject(new Error('UNEXPECTED_ERROR')))
        };
        const shellCommandExecContext = {getCwd: () => {}};
        const service = new ShellCommandService({childProcess, processRunner, shellCommandExecContext});
        const params = {command: 'COMMAND_STRING'};
        return service.runCommand(params).then(
            throwError,
            e => {
                expect(e).to.be.an('error');
                expect(e.message).to.eql('UNEXPECTED_ERROR');
            }
        );
    });

});
