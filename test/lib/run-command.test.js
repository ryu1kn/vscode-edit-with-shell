
const Editor = require('../../lib/editor');
const RunCommand = require('../../lib/run-command');

describe('RunCommand', () => {

    it('runs command with editor contents and add commands to the history', () => {
        const historyStore = {add: sinon.spy()};
        const shellCommandService = {
            runCommand: sinon.stub().returns(Promise.resolve('COMMAND_OUTPUT'))
        };
        const command = new RunCommand({
            commandReader: {read: () => Promise.resolve('COMMAND_STRING')},
            historyStore,
            shellCommandService,
            wrapEditor: editor => new Editor(editor)
        });

        const editor = fakeEditor('SELECTED_TEXT');
        return command.execute(editor).then(() => {
            expect(editor._editBuilder.replace).to.have.been.calledWith(
                editor.selection,
                'COMMAND_OUTPUT'
            );
            expect(shellCommandService.runCommand).to.have.been.calledWith({
                command: 'COMMAND_STRING',
                input: 'SELECTED_TEXT',
                filePath: 'FILE_NAME'
            });
            expect(historyStore.add).to.have.been.calledWith('COMMAND_STRING');
        });
    });

    it('does not try to run a command if one is not given', () => {
        const historyStore = {add: sinon.spy()};
        const shellCommandService = {
            runCommand: sinon.stub().returns(Promise.resolve('COMMAND_OUTPUT'))
        };
        const command = new RunCommand({
            commandReader: {read: () => Promise.resolve()},
            historyStore,
            shellCommandService,
            wrapEditor: editor => new Editor(editor)
        });

        const editor = fakeEditor('SELECTED_TEXT');
        return command.execute(editor).then(() => {
            expect(editor._editBuilder.replace).to.have.been.not.called;
            expect(shellCommandService.runCommand).to.have.been.not.called;
            expect(historyStore.add).to.have.been.not.called;
        });
    });

    it('reports an error', () => {
        const logger = {error: sinon.spy()};
        const showErrorMessage = sinon.spy();
        const command = new RunCommand({
            commandReader: {
                read: () => Promise.reject(new Error('UNEXPECTED_ERROR'))
            },
            logger,
            showErrorMessage,
            wrapEditor: editor => new Editor(editor)
        });
        return command.execute().then(() => {
            expect(showErrorMessage).to.have.been.calledWith('UNEXPECTED_ERROR');
            expect(logger.error.args[0][0]).to.have.string('Error: UNEXPECTED_ERROR');
        });
    });

    it('escape newline characters to show all lines when showing an error message', () => {
        const showErrorMessage = sinon.spy();
        const command = new RunCommand({
            commandReader: {
                read: () => Promise.reject(new Error('MESSAGE\nCONTAINS\nNEWLINES\n'))
            },
            logger: {error: () => {}},
            showErrorMessage,
            wrapEditor: editor => new Editor(editor)
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
                getText: sinon.stub().returns(selectedText),
                uri: {
                    scheme: 'file',
                    fsPath: 'FILE_NAME'
                }
            },
            edit: function (callback) {
                callback(this._editBuilder);
            },
            _editBuilder: {replace: sinon.spy()}
        };
    }

});
