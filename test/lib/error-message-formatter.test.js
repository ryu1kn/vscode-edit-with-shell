
const ErrorMessageFormatter = require('../../lib/error-message-formatter');

describe('ErrorMessageFormatter', () => {

    const formatter = new ErrorMessageFormatter();

    it('pass through normal text', () => {
        const formattedText = formatter.format('normal text');
        expect(formattedText).to.eql('normal text');
    });

    it('escape newline characters to show all lines in one line', () => {
        const formattedText = formatter.format('MESSAGE\nCONTAINS\nNEWLINES\n');
        expect(formattedText).to.eql('MESSAGE\\nCONTAINS\\nNEWLINES');
    });

});
