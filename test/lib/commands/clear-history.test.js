
const ClearHistoryCommand = require('../../../lib/commands/clear-history');

describe('ClearHistoryCommand', () => {

    it('clears command history', async () => {
        const historyStore = {clear: sinon.spy()};
        const command = new ClearHistoryCommand({historyStore});

        await command.execute();

        expect(historyStore.clear).to.have.been.called;
    });

    it('reports an error', async () => {
        const logger = {error: sinon.spy()};
        const showErrorMessage = sinon.spy();
        const command = new ClearHistoryCommand({
            historyStore: {clear: () => { throw new Error('UNEXPECTED_ERROR'); }},
            logger,
            showErrorMessage
        });

        await command.execute();

        expect(showErrorMessage).to.have.been.calledWith('UNEXPECTED\\_ERROR');
        expect(logger.error.args[0][0]).to.have.string('Error: UNEXPECTED_ERROR');
    });

});
