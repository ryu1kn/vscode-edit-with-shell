
const CommandRunner = require('../../lib/command-runner');

describe('CommandRunner', () => {

    it('Runs a given command and collects the command output', () => {
        const childProcess = {
            exec: sinon.stub().callsArgWith(2, null, 'COMMAND_OUTPUT')
        };
        const runner = new CommandRunner({childProcess});
        return runner.run('COMMAND', 'SELECTED_TEXT').then(output => {
            expect(output).to.eql('COMMAND_OUTPUT');
            expect(childProcess.exec).to.have.been.calledWith(
                'printf "$CR_SELECTION" | COMMAND',
                {
                    env: {CR_SELECTION: 'SELECTED_TEXT'}
                }
            );
        });
    });

    it('does not give an input to the command if no text is selected in the editor', () => {
        const childProcess = {
            exec: sinon.stub().callsArgWith(2, null, 'COMMAND_OUTPUT')
        };
        const runner = new CommandRunner({childProcess});
        return runner.run('COMMAND').then(output => {
            expect(output).to.eql('COMMAND_OUTPUT');
            expect(childProcess.exec).to.have.been.calledWith('COMMAND', {});
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
