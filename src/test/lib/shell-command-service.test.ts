import * as assert from 'assert';
import {any, contains, mock, mockMethods, mockType, when} from '../helper';
import ShellCommandService, {SpawnWrapper} from '../../lib/shell-command-service';
import ShellCommandExecContext from '../../lib/shell-command-exec-context';
import ProcessRunner from '../../lib/process-runner';
import {ChildProcess} from 'child_process';

describe('ShellCommandService', () => {

    let childProcess: SpawnWrapper;
    let processRunner: ProcessRunner;
    let shellCommandExecContext: ShellCommandExecContext;
    let service: ShellCommandService;

    beforeEach(() => {
        const process = mockType<ChildProcess>();

        childProcess = mockMethods(['spawn']);
        when(childProcess.spawn('SHELL_PATH', ['SHELL_ARG', 'COMMAND_STRING'], any())).thenReturn(process);
        when(childProcess.spawn('SHELL_PATH', ['SHELL_ARG', 'COMMAND_TEST_WITH_ENVVARS'], contains({env: {SOME_ENV_VAR: '...'}}))).thenReturn(process);
        when(childProcess.spawn('SHELL_PATH', ['SHELL_ARG', 'COMMAND_TEST_WITH_EXEC_DIR'], contains({cwd: 'COMMAND_EXEC_DIR'}))).thenReturn(process);

        processRunner = mock(ProcessRunner);
        when(processRunner.run(process, '')).thenResolve('COMMAND_OUTPUT');
        when(processRunner.run(process, 'SELECTED_TEXT')).thenResolve('COMMAND_OUTPUT_TEST_WITH_INPUT');
        when(processRunner.run(process, 'CAUSE_ERROR_INPUT')).thenReject(new Error('UNEXPECTED_ERROR'));

        shellCommandExecContext = mockMethods<ShellCommandExecContext>(['getCwd'], {
            env: {SOME_ENV_VAR: '...'}
        });
        when(shellCommandExecContext.getCwd('FILE_PATH')).thenReturn('COMMAND_EXEC_DIR');

        service = createShellCommandService({childProcess, processRunner, shellCommandExecContext});
    });

    it('runs a given command on shell', async () => {
        const params = {command: 'COMMAND_STRING', input: ''};
        const output = await service.runCommand(params);

        assert.deepEqual(output, 'COMMAND_OUTPUT');
    });

    it('passes selected text in the editor to the command', async () => {
        const params = {
            command: 'COMMAND_STRING',
            input: 'SELECTED_TEXT'
        };
        const output = await service.runCommand(params);

        assert.deepEqual(output, 'COMMAND_OUTPUT_TEST_WITH_INPUT');
    });

    it('inherits environment variables on executing a command', async () => {
        const params = {command: 'COMMAND_TEST_WITH_ENVVARS', input: ''};
        const output = await service.runCommand(params);

        assert.deepEqual(output, 'COMMAND_OUTPUT');
    });

    it('executes a command on a specific directory', async () => {
        const params = {
            command: 'COMMAND_TEST_WITH_EXEC_DIR',
            input: '',
            filePath: 'FILE_PATH'
        };
        const output = await service.runCommand(params);

        assert.deepEqual(output, 'COMMAND_OUTPUT');
    });

    it('throws an error if command failed', async () => {
        const service = createShellCommandService({childProcess, processRunner, shellCommandExecContext});
        const params = {
            command: 'COMMAND_STRING',
            input: 'CAUSE_ERROR_INPUT'
        };

        try {
            await service.runCommand(params);
            throw new Error('Should not have been called');
        } catch (e) {
            assert.deepEqual(e.message, 'UNEXPECTED_ERROR');
        }
    });

    function createShellCommandService({childProcess, processRunner, shellCommandExecContext}: any) {
        return new ShellCommandService({
            childProcess,
            processRunner,
            shellCommandExecContext,
            shellProgrammeResolver: {resolve: () => 'SHELL_PATH'},
            shellArgsRetriever: {retrieve: () => ['SHELL_ARG']}
        });
    }
});
