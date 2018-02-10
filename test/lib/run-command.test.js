
const RunCommand = require('../../lib/run-command');

describe('RunCommand', () => {

    it('runs command with editor contents and add commands to the history', async () => {
        const historyStore = {add: sinon.spy()};
        const shellCommandService = {
            runCommand: sinon.stub().returns(Promise.resolve('COMMAND_OUTPUT'))
        };
        const replaceSelectedTextWith = sinon.stub().returns(Promise.resolve());
        const wrapEditor = sinon.stub().returns({
            selectedText: 'SELECTED_TEXT',
            filePath: 'FILE_NAME',
            replaceSelectedTextWith
        });
        const command = new RunCommand({
            commandReader: {read: () => Promise.resolve('COMMAND_STRING')},
            historyStore,
            shellCommandService,
            wrapEditor
        });

        await command.execute('EDITOR');

        expect(wrapEditor).to.have.been.calledWith('EDITOR');
        expect(replaceSelectedTextWith).to.have.been.calledWith('COMMAND_OUTPUT');
        expect(shellCommandService.runCommand).to.have.been.calledWith({
            command: 'COMMAND_STRING',
            input: 'SELECTED_TEXT',
            filePath: 'FILE_NAME'
        });
        expect(historyStore.add).to.have.been.calledWith('COMMAND_STRING');
    });

    it('does not try to run a command if one is not given', async () => {
        const historyStore = {add: sinon.spy()};
        const shellCommandService = {
            runCommand: sinon.stub().returns(Promise.resolve('COMMAND_OUTPUT'))
        };
        const replaceSelectedTextWith = sinon.stub().returns(Promise.resolve());
        const command = new RunCommand({
            commandReader: {read: () => Promise.resolve()},
            historyStore,
            shellCommandService,
            wrapEditor: () => ({})
        });

        await command.execute('EDITOR');

        expect(replaceSelectedTextWith).to.have.been.not.called;
        expect(shellCommandService.runCommand).to.have.been.not.called;
        expect(historyStore.add).to.have.been.not.called;
    });

    it('reports an error', async () => {
        const logger = {error: sinon.spy()};
        const showErrorMessage = sinon.spy();
        const command = new RunCommand({
            commandReader: {
                read: () => Promise.reject(new Error('UNEXPECTED_ERROR'))
            },
            logger,
            showErrorMessage,
            wrapEditor: () => {}
        });

        await command.execute();

        expect(showErrorMessage).to.have.been.calledWith('UNEXPECTED\\_ERROR');
        expect(logger.error.args[0][0]).to.have.string('Error: UNEXPECTED_ERROR');
    });

});
