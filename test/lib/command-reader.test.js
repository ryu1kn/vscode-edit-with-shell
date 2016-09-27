
const CommandReader = require('../../lib/command-reader');

describe('CommandReader', () => {

    it('reads an command string', () => {
        const vscodeWindow = {
            showInputBox: () => Promise.resolve('COMMAND_STRING')
        };
        const reader = new CommandReader({vsWindow: vscodeWindow});
        return reader.read().then(command => {
            expect(command).to.eql('COMMAND_STRING');
        });
    });

});
