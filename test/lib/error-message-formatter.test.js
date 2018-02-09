
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

    it('escape `*` character', () => {
        const formattedText = formatter.format('**bold**');
        expect(formattedText).to.eql('\\*\\*bold\\*\\*');
    });

    it('escape `_` character', () => {
        const formattedText = formatter.format('__italic__');
        expect(formattedText).to.eql('\\_\\_italic\\_\\_');
    });

    it('escape `[` character', () => {
        const formattedText = formatter.format('[[');
        expect(formattedText).to.eql('\\[\\[');
    });

    it('escape `]` character', () => {
        const formattedText = formatter.format(']]');
        expect(formattedText).to.eql('\\]\\]');
    });

});
