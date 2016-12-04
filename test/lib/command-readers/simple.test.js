
const SimpleCommandReader = require('../../../lib/command-readers/simple');

describe('SimpleCommandReader', () => {

    it('reads an command string', () => {
        const vscodeWindow = {
            showInputBox: () => Promise.resolve('COMMAND_STRING')
        };
        const reader = new SimpleCommandReader({vsWindow: vscodeWindow});
        return reader.read().then(command => {
            expect(command).to.eql('COMMAND_STRING');
        });
    });

});
