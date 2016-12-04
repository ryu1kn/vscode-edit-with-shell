
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
            expect(vscodeWindow.showQuickPick.args[0][0]).to.eql(['COMMAND_1', 'COMMAND_2']);
            expect(vscodeWindow.showInputBox.args[0][0]).to.eql({value: 'COMMAND_1'});
        });
    });

});
