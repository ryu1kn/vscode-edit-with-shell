import ClearHistoryCommand from '../../../lib/commands/clear-history';
import HistoryStore from '../../../lib/history-store';
import {mockMethods, verify} from '../../helper';

describe('ClearHistoryCommand', () => {
    const historyStore = mockMethods<HistoryStore>(['clear']);
    const command = new ClearHistoryCommand(historyStore);

    it('clears command history', async () => {
        await command.execute();

        verify(historyStore.clear(), {times: 1});
    });
});
