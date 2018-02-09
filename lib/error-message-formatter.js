
const REPLACE_PAIRS = [
    ['\n', '\\n'],
    ['*', '\\*'],
    ['_', '\\_'],
    ['[', '\\['],
    [']', '\\]']
];

class ErrorMessageFormatter {

    format(message) {
        const trimmedMessage = (message || '').trim();
        return this._escapeText(trimmedMessage);
    }

    _escapeText(string) {
        return REPLACE_PAIRS.reduce(
            (s, pair) => replaceAll(s, pair[0], pair[1]),
            string
        );
    }

}

function replaceAll(string, fromStr, toStr) {
    return string.split(fromStr).join(toStr);
}

module.exports = ErrorMessageFormatter;
