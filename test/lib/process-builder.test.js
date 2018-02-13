
const ProcessBuilder = require('../../lib/process-builder');

describe('ProcessBuilderProvider', () => {
    let childProcess;
    let shellCommandExecContext;
    let processBuilder;

    beforeEach(() => {
        childProcess = {
            spawn: stubWithArgs(
                ['SHELL_PATH', ['SHELL_ARG', 'COMMAND_STRING']], 'COMMAND',
                ['SHELL_PATH', ['SHELL_ARG', 'COMMAND_STRING_TEST_WITH_ENVVARS'], sinon.match({env: {SOME_ENV_VAR: '...'}})], 'COMMAND_TEST_WITH_ENVVARS',
                ['SHELL_PATH', ['SHELL_ARG', 'COMMAND_STRING_TEST_WITH_EXEC_DIR'], sinon.match({cwd: 'COMMAND_EXEC_DIR'})], 'COMMAND_TEST_WITH_EXEC_DIR'
            )
        };
        shellCommandExecContext = {
            env: {SOME_ENV_VAR: '...'},
            getCwd: stubWithArgs(['FILE_PATH'], 'COMMAND_EXEC_DIR')
        };
        processBuilder = new ProcessBuilder({
            childProcess,
            shellCommandExecContext,
            shellProgrammeResolver: {resolve: () => 'SHELL_PATH'},
            shellArgsRetriever: {retrieve: () => ['SHELL_ARG']}
        });
    });

    it('runs a given command on shell', () => {
        const params = {command: 'COMMAND_STRING'};
        const command = processBuilder.build(params);

        expect(command).to.eql('COMMAND');
    });

    it('inherits environment variables on executing a command', () => {
        const params = {command: 'COMMAND_STRING_TEST_WITH_ENVVARS'};
        const command = processBuilder.build(params);

        expect(command).to.eql('COMMAND_TEST_WITH_ENVVARS');
    });

    it('executes a command on a specific directory', () => {
        const params = {
            command: 'COMMAND_STRING_TEST_WITH_EXEC_DIR',
            filePath: 'FILE_PATH'
        };
        const command = processBuilder.build(params);

        expect(command).to.eql('COMMAND_TEST_WITH_EXEC_DIR');
    });

});
