
const HistoricalCommandReader = require('../../../lib/command-readers/historical');

describe('HistoricalCommandReader', () => {

    it('allows user to pick and modify a past command. Commands shown last one first', () => {
        const vscodeWindow = {
            showInputBox: sinon.stub().returns(Promise.resolve('COMMAND_FINAL')),
            showQuickPick: sinon.stub().returns(Promise.resolve('COMMAND_1'))
        };
        const historyStore = {getAll: () => ['COMMAND_1', 'COMMAND_2']};
        const reader = new HistoricalCommandReader({historyStore, vsWindow: vscodeWindow});
        return reader.read().then(command => {
            expect(command).to.eql('COMMAND_FINAL');
            expect(vscodeWindow.showQuickPick).to.have.been.calledWith(
                ['COMMAND_2', 'COMMAND_1'],
                {placeHolder: 'Select a command to reuse or Cancel (Esc) to write a new command'}
            );
            expect(vscodeWindow.showInputBox).to.have.been.calledWith({
                placeHolder: 'Enter a command',
                prompt: 'Edit the command if necessary',
                value: 'COMMAND_1'
            });
        });
    });

    it('shows inputBox right away if there is no commands recorded in the history', () => {
        const vscodeWindow = {
            showInputBox: sinon.stub().returns(Promise.resolve('COMMAND')),
            showQuickPick: sinon.spy()
        };
        const historyStore = {getAll: () => []};
        const reader = new HistoricalCommandReader({historyStore, vsWindow: vscodeWindow});
        return reader.read().then(command => {
            expect(command).to.eql('COMMAND');
            expect(vscodeWindow.showQuickPick).to.not.have.been.called;
            expect(vscodeWindow.showInputBox).to.have.been.calledWith({
                placeHolder: 'Enter a command',
                prompt: 'No history available yet'
            });
        });
    });

    it('shows inputBox if history command picker is dismissed', () => {
        const vscodeWindow = {
            showInputBox: sinon.stub().returns(Promise.resolve('COMMAND')),
            showQuickPick: () => Promise.resolve()
        };
        const historyStore = {getAll: () => ['COMMAND_1', 'COMMAND_2']};
        const reader = new HistoricalCommandReader({historyStore, vsWindow: vscodeWindow});
        return reader.read().then(command => {
            expect(command).to.eql('COMMAND');
            expect(vscodeWindow.showInputBox).to.have.been.calledWith({
                placeHolder: 'Enter a command'
            });
        });
    });

});
