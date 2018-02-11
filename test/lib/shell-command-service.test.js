
const ShellCommandService = require('../../lib/shell-command-service');

describe('ShellCommandService', () => {

    it('runs a given command on shell', async () => {
        const childProcess = {spawn: stubWithArgs(['COMMAND_STRING'], 'COMMAND')};
        const processRunner = {run: stubWithArgs(['COMMAND'], Promise.resolve('COMMAND_OUTPUT'))};
        const shellCommandExecContext = {getCwd: () => {}};
        const service = createShellCommandService({childProcess, processRunner, shellCommandExecContext});
        const params = {command: 'COMMAND_STRING'};

        const output = await service.runCommand(params);

        expect(output).to.eql('COMMAND_OUTPUT');
        expect(childProcess.spawn.args[0][1]).to.include({shell: 'SHELL_PATH'});
    });

    it('passes selected text in the editor to the command', async () => {
        const childProcess = {spawn: stubWithArgs(['COMMAND_STRING'], 'COMMAND')};
        const processRunner = {run: stubWithArgs(['COMMAND', 'SELECTED_TEXT'], Promise.resolve('COMMAND_OUTPUT'))};
        const shellCommandExecContext = {getCwd: () => {}};
        const service = createShellCommandService({childProcess, processRunner, shellCommandExecContext});
        const params = {
            command: 'COMMAND_STRING',
            input: 'SELECTED_TEXT'
        };

        const output = await service.runCommand(params);

        expect(output).to.eql('COMMAND_OUTPUT');
    });

    it('inherits environment variables on executing a command', async () => {
        const childProcess = {spawn: stubWithArgs(['COMMAND_STRING'], 'COMMAND')};
        const processRunner = {run: stubWithArgs(['COMMAND'], Promise.resolve('COMMAND_OUTPUT'))};
        const shellCommandExecContext = {
            env: {SOME_ENV_VAR: '...'},
            getCwd: () => {}
        };
        const service = createShellCommandService({childProcess, processRunner, shellCommandExecContext});
        const params = {command: 'COMMAND_STRING'};

        await service.runCommand(params);

        const spawnArgs = childProcess.spawn.args[0];
        expect(spawnArgs[1].env).to.eql({SOME_ENV_VAR: '...'});
    });

    it('executes a command on a specific directory', async () => {
        const childProcess = {spawn: stubWithArgs(['COMMAND_STRING'], 'COMMAND')};
        const processRunner = {run: stubWithArgs(['COMMAND'], Promise.resolve('COMMAND_OUTPUT'))};
        const shellCommandExecContext = {
            env: {SOME_ENV_VAR: '...'},
            getCwd: stubWithArgs(['FILE_PATH'], 'COMMAND_EXEC_DIR')
        };
        const service = createShellCommandService({childProcess, processRunner, shellCommandExecContext});
        const params = {
            command: 'COMMAND_STRING',
            filePath: 'FILE_PATH'
        };

        await service.runCommand(params);

        expect(childProcess.spawn.args[0][1]).to.include({cwd: 'COMMAND_EXEC_DIR'});
    });

    it('does not give an input to the command if no text is selected in the editor', async () => {
        const childProcess = {spawn: stubWithArgs(['COMMAND_STRING'], 'COMMAND')};
        const processRunner = {run: stubWithArgs(['COMMAND', undefined], Promise.resolve('COMMAND_OUTPUT'))};
        const shellCommandExecContext = {getCwd: () => {}};
        const service = createShellCommandService({childProcess, processRunner, shellCommandExecContext});
        const params = {command: 'COMMAND_STRING'};

        const output = await service.runCommand(params);

        expect(output).to.eql('COMMAND_OUTPUT');
    });

    it('throws an error if command failed', async () => {
        const childProcess = {spawn: stubWithArgs(['COMMAND_STRING'], 'COMMAND')};
        const processRunner = {run: stubWithArgs(['COMMAND', undefined], Promise.reject(new Error('UNEXPECTED_ERROR')))};
        const shellCommandExecContext = {getCwd: () => {}};
        const service = createShellCommandService({childProcess, processRunner, shellCommandExecContext});
        const params = {command: 'COMMAND_STRING'};

        try {
            await service.runCommand(params);
            throw new Error('Should not have been called');
        } catch (e) {
            expect(e.message).to.eql('UNEXPECTED_ERROR');
        }
    });

    function createShellCommandService({childProcess, processRunner, shellCommandExecContext}) {
        return new ShellCommandService({
            childProcess,
            processRunner,
            shellCommandExecContext,
            shellPathResolver: {resolve: () => 'SHELL_PATH'}
        });
    }
});
