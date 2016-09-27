
const RunCommand = require('../../../lib/command/run');

describe('RunCommand', () => {

    it('runs command with editor contents', () => {
        const commandRunner = {
            run: sinon.stub().returns(Promise.resolve('COMMAND_OUTPUT'))
        };
        const command = new RunCommand({
            commandReader: {
                read: () => Promise.resolve('COMMAND_STRING')
            },
            commandRunner
        });

        const editor = fakeEditor('SELECTED_TEXT');
        return command.execute(editor).then(() => {
            expect(editor._editBuilder.replace).to.have.been.calledWith(
                editor.selection,
                'COMMAND_OUTPUT'
            );
            expect(commandRunner.run).to.have.been.calledWith('COMMAND_STRING', 'SELECTED_TEXT');
        });
    });

    it('logs an error', () => {
        const logger = {error: sinon.spy()};
        const command = new RunCommand({
            commandReader: {
                read: () => Promise.reject(new Error('COMMAND_READER_ERROR'))
            },
            logger
        });
        return command.execute().then(() => {
            expect(logger.error.args[0][0]).to.have.string('Error: COMMAND_READER_ERROR');
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
