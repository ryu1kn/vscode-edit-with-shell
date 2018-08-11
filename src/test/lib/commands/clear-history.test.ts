import ClearHistoryCommand from '../../../lib/commands/clear-history';
import HistoryStore from '../../../lib/history-store';
import {contains, mockFunction, mockMethods, verify} from '../../helper';
import {Logger} from '../../../lib/logger';

describe('ClearHistoryCommand', () => {

    it('clears command history', async () => {
        const historyStore = mockMethods<HistoryStore>(['clear']);
        const command = new ClearHistoryCommand({historyStore});

        await command.execute();

        verify(historyStore.clear(), {times: 1});
    });

    it('reports an error', async () => {
        const logger = mockMethods<Logger>(['error']);
        const showErrorMessage = mockFunction();
        const command = new ClearHistoryCommand({
            historyStore: {clear: () => { throw new Error('UNEXPECTED_ERROR'); }},
            logger,
            showErrorMessage
        });

        await command.execute();

        verify(showErrorMessage(contains('UNEXPECTED\\_ERROR')));
        verify(logger.error(contains('Error: UNEXPECTED_ERROR')));
    });

});
