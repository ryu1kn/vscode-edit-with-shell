
const CommandRunner = require('../../lib/command-runner');

describe('CommandRunner', () => {

    it('Runs a given command and collects the command output', () => {
        const childProcess = {
            exec: sinon.stub().callsArgWith(2, null, 'COMMAND_OUTPUT')
        };
        const runner = new CommandRunner({childProcess});
        return runner.run('COMMAND').then(output => {
            expect(output).to.eql('COMMAND_OUTPUT');
            expect(childProcess.exec).to.have.been.calledWith(
                'echo "$CR_SELECTION" | COMMAND',
                {
                    env: {CR_SELECTION: undefined}
                }
            );
        });
    });

    it('trims the last one newline character in the command output', () => {
        const childProcess = {
            exec: sinon.stub().callsArgWith(2, null, 'COMMAND_OUTPUT\n\n')
        };
        const runner = new CommandRunner({childProcess});
        return runner.run('COMMAND').then(output => {
            expect(output).to.eql('COMMAND_OUTPUT\n');
        });
    });

    it('throws an error if command failed', () => {
        const childProcess = {
            exec: sinon.stub().callsArgWith(2, new Error('EXEC_ERROR'))
        };
        const runner = new CommandRunner({childProcess});
        return runner.run('COMMAND').then(
            throwError,
            e => {
                expect(e).to.be.an('error');
                expect(e.message).to.eql('EXEC_ERROR');
            }
        );
    });

});
