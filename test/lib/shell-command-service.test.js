
const ShellCommandService = require('../../lib/shell-command-service');

describe('ShellCommandService', () => {

    let childProcess;
    let processRunner;
    let shellCommandExecContext;
    let service;

    beforeEach(() => {
        childProcess = {
            spawn: stubWithArgs(
                ['SHELL_PATH', ['SHELL_ARGS', 'COMMAND_STRING']], 'COMMAND',
                ['SHELL_PATH', ['SHELL_ARGS', 'COMMAND_TEST_WITH_ENVVARS'], sinon.match({env: {SOME_ENV_VAR: '...'}})], 'COMMAND',
                ['SHELL_PATH', ['SHELL_ARGS', 'COMMAND_TEST_WITH_EXEC_DIR'], sinon.match({cwd: 'COMMAND_EXEC_DIR'})], 'COMMAND'
            )
        };
        processRunner = {
            run: stubWithArgs(
                ['COMMAND', undefined], Promise.resolve('COMMAND_OUTPUT'),
                ['COMMAND', 'SELECTED_TEXT'], Promise.resolve('COMMAND_OUTPUT_TEST_WITH_INPUT')
            )
        };
        shellCommandExecContext = {
            env: {SOME_ENV_VAR: '...'},
            getCwd: stubWithArgs(['FILE_PATH'], 'COMMAND_EXEC_DIR')
        };
        service = createShellCommandService({childProcess, processRunner, shellCommandExecContext});
    });

    it('runs a given command on shell', async () => {
        const params = {command: 'COMMAND_STRING'};
        const output = await service.runCommand(params);

        expect(output).to.eql('COMMAND_OUTPUT');
    });

    it('passes selected text in the editor to the command', async () => {
        const params = {
            command: 'COMMAND_STRING',
            input: 'SELECTED_TEXT'
        };
        const output = await service.runCommand(params);

        expect(output).to.eql('COMMAND_OUTPUT_TEST_WITH_INPUT');
    });

    it('inherits environment variables on executing a command', async () => {
        const params = {command: 'COMMAND_TEST_WITH_ENVVARS'};
        const output = await service.runCommand(params);

        expect(output).to.eql('COMMAND_OUTPUT');
    });

    it('executes a command on a specific directory', async () => {
        const params = {
            command: 'COMMAND_TEST_WITH_EXEC_DIR',
            filePath: 'FILE_PATH'
        };
        const output = await service.runCommand(params);

        expect(output).to.eql('COMMAND_OUTPUT');
    });

    it('throws an error if command failed', async () => {
        // Cannot put this behaviour in the initial mock setup as it creates never
        // handled promise rejections for other test cases...
        const processRunner = {
            run: stubWithArgs(['COMMAND', 'CAUSE_ERROR_INPUT'], Promise.reject(new Error('UNEXPECTED_ERROR')))
        };
        const service = createShellCommandService({childProcess, processRunner, shellCommandExecContext});
        const params = {
            command: 'COMMAND_STRING',
            input: 'CAUSE_ERROR_INPUT'
        };

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
            shellPathResolver: {resolve: () => 'SHELL_PATH'},
            shellArgsResolver: {resolve: () => 'SHELL_ARGS'}
        });
    }
});
