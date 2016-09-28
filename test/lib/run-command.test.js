
const RunCommand = require('../../lib/run-command');

describe('RunCommand', () => {

    it('runs command with editor contents', () => {
        const shellCommandService = {
            runCommand: sinon.stub().returns(Promise.resolve('COMMAND_OUTPUT'))
        };
        const command = new RunCommand({
            commandReader: {
                read: () => Promise.resolve('COMMAND_STRING')
            },
            shellCommandService
        });

        const editor = fakeEditor('SELECTED_TEXT');
        return command.execute(editor).then(() => {
            expect(editor._editBuilder.replace).to.have.been.calledWith(
                editor.selection,
                'COMMAND_OUTPUT'
            );
            expect(shellCommandService.runCommand).to.have.been.calledWith('COMMAND_STRING', 'SELECTED_TEXT');
        });
    });

    it('reports an error', () => {
        const logger = {error: sinon.spy()};
        const showErrorMessage = sinon.spy();
        const command = new RunCommand({
            commandReader: {
                read: () => Promise.reject(new Error('COMMAND_READER_ERROR'))
            },
            logger,
            showErrorMessage
        });
        return command.execute().then(() => {
            expect(showErrorMessage).to.have.been.calledWith('COMMAND_READER_ERROR');
            expect(logger.error.args[0][0]).to.have.string('Error: COMMAND_READER_ERROR');
        });
    });

    it('escape newline characters to show all lines when showing an error message', () => {
        const showErrorMessage = sinon.spy();
        const command = new RunCommand({
            commandReader: {
                read: () => Promise.reject(new Error('MESSAGE\nCONTAINS\nNEWLINES\n'))
            },
            logger: {error: () => {}},
            showErrorMessage
        });
        return command.execute().then(() => {
            expect(showErrorMessage).to.have.been.calledWith('MESSAGE\\nCONTAINS\\nNEWLINES');
        });
    });

    function fakeEditor(selectedText) {
        return {
            selection: {
                text: selectedText,
                isEmpty: !selectedText
            },
            document: {
                getText: sinon.stub().returns(selectedText)
            },
            edit: function (callback) {
                callback(this._editBuilder);
            },
            _editBuilder: {replace: sinon.spy()}
        };
    }

});
