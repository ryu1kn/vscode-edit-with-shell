
const ShellCommandService = require('../../lib/shell-command-service');

describe('ShellCommandService', () => {
    let processBuilder;
    let processRunner;
    let service;

    beforeEach(() => {
        processBuilder = {
            build: stubWithArgs([sinon.match({command: 'COMMAND_STRING'})], 'COMMAND')
        };
        processRunner = {
            run: stubWithArgs(
                ['COMMAND', undefined], Promise.resolve('COMMAND_OUTPUT'),
                ['COMMAND', 'SELECTED_TEXT'], Promise.resolve('COMMAND_OUTPUT_TEST_WITH_INPUT')
            )
        };
        service = createShellCommandService({processBuilder, processRunner});
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

    it('throws an error if command failed', async () => {
        // Cannot put this behaviour in the initial mock setup as it creates never
        // handled promise rejections for other test cases...
        const processRunner = {
            run: stubWithArgs(['COMMAND', 'CAUSE_ERROR_INPUT'], Promise.reject(new Error('UNEXPECTED_ERROR')))
        };
        const service = createShellCommandService({processBuilder, processRunner});
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

    function createShellCommandService({processBuilder, processRunner}) {
        return new ShellCommandService({
            processRunner,
            processBuilderProvider: {provide: () => processBuilder}
        });
    }
});
