
const HistoricalCommandReader = require('../../lib/historical-command-reader');

describe('HistoricalCommandReader', () => {

    it('allows user to pick and modify a past command', () => {
        const vscodeWindow = {
            showInputBox: sinon.stub().returns(Promise.resolve('COMMAND_FINAL')),
            showQuickPick: sinon.stub().returns(Promise.resolve('COMMAND_1'))
        };
        const historyStore = {getAll: () => ['COMMAND_1', 'COMMAND_2']};
        const reader = new HistoricalCommandReader({historyStore, vsWindow: vscodeWindow});
        return reader.read().then(command => {
            expect(command).to.eql('COMMAND_FINAL');
            expect(vscodeWindow.showQuickPick).to.have.been.calledWith(['COMMAND_1', 'COMMAND_2']);
            expect(vscodeWindow.showInputBox).to.have.been.calledWith({value: 'COMMAND_1'});
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
            expect(vscodeWindow.showQuickPick).to.have.been.not.called;
            expect(vscodeWindow.showInputBox).to.have.been.calledWith();
        });
    });

});
