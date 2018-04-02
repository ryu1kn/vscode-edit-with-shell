
const HistoryStore = require('../../lib/history-store');

describe('HistoryStore', () => {

    it('retrieves all recorded commands', () => {
        const historyStore = new HistoryStore();
        historyStore.add('COMMAND_1');
        historyStore.add('COMMAND_2');
        expect(historyStore.getAll()).to.eql(['COMMAND_1', 'COMMAND_2']);
    });

    it('does not record the same command twice', () => {
        const historyStore = new HistoryStore();
        historyStore.add('COMMAND_1');
        historyStore.add('COMMAND_1');
        expect(historyStore.getAll()).to.eql(['COMMAND_1']);
    });

    it('returns the last used command at the end', () => {
        const historyStore = new HistoryStore();
        historyStore.add('COMMAND_1');
        historyStore.add('COMMAND_2');
        historyStore.add('COMMAND_1');
        expect(historyStore.getAll()).to.eql(['COMMAND_2', 'COMMAND_1']);
    });

    it('returns an empty list if no commands are recorded yet', () => {
        const historyStore = new HistoryStore();
        expect(historyStore.getAll()).to.eql([]);
    });

    it('clears all history', () => {
        const historyStore = new HistoryStore();
        historyStore.add('COMMAND_1');
        historyStore.add('COMMAND_2');
        historyStore.clear();
        expect(historyStore.getAll()).to.eql([]);
    });

});
