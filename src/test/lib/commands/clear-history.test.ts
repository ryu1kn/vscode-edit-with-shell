import ClearHistoryCommand from '../../../lib/commands/clear-history';
import HistoryStore from '../../../lib/history-store';
import {contains, mock, mockFunction, mockMethods, mockType, verify, when} from '../../helper';
import {Logger} from '../../../lib/logger';
import {ShowErrorMessage} from '../../../lib/types/vscode';

describe('ClearHistoryCommand', () => {

    it('clears command history', async () => {
        const historyStore = mockMethods<HistoryStore>(['clear']);
        const showErrorMessage = mockFunction() as ShowErrorMessage;
        const command = new ClearHistoryCommand(historyStore, showErrorMessage, mockType<Logger>());

        await command.execute();

        verify(historyStore.clear(), {times: 1});
    });

    it('reports an error', async () => {
        const logger = mockMethods<Logger>(['error']);
        const historyStore = mock(HistoryStore);
        when(historyStore.clear()).thenThrow(new Error('UNEXPECTED_ERROR'));
        const showErrorMessage = mockFunction() as ShowErrorMessage;
        const command = new ClearHistoryCommand(historyStore, showErrorMessage, logger);

        await command.execute();

        verify(showErrorMessage(contains('UNEXPECTED\\_ERROR')));
        verify(logger.error(contains('Error: UNEXPECTED_ERROR')));
    });

});
