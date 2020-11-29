import * as assert from 'assert';
import {ErrorMessageFormatter} from '../../lib/error-message-formatter';

describe('ErrorMessageFormatter', () => {

    const formatter = new ErrorMessageFormatter();

    it('pass through normal text', () => {
        const formattedText = formatter.format('normal text');
        assert.deepStrictEqual(formattedText, 'normal text');
    });

    it('escape newline characters to show all lines in one line', () => {
        const formattedText = formatter.format('MESSAGE\nCONTAINS\nNEWLINES\n');
        assert.deepStrictEqual(formattedText, 'MESSAGE\\nCONTAINS\\nNEWLINES');
    });

    it('escape `*` character', () => {
        const formattedText = formatter.format('**bold**');
        assert.deepStrictEqual(formattedText, '\\*\\*bold\\*\\*');
    });

    it('escape `_` character', () => {
        const formattedText = formatter.format('__italic__');
        assert.deepStrictEqual(formattedText, '\\_\\_italic\\_\\_');
    });

    it('escape `[` character', () => {
        const formattedText = formatter.format('[[');
        assert.deepStrictEqual(formattedText, '\\[\\[');
    });

    it('escape `]` character', () => {
        const formattedText = formatter.format(']]');
        assert.deepStrictEqual(formattedText, '\\]\\]');
    });

});
