
const REPLACE_PAIRS = [
    ['\n', '\\n'],
    ['*', '\\*'],
    ['_', '\\_'],
    ['[', '\\['],
    [']', '\\]']
];

export default class ErrorMessageFormatter {

    format(message: string) {
        const trimmedMessage = (message || '').trim();
        return this._escapeText(trimmedMessage);
    }

    _escapeText(string: string) {
        return REPLACE_PAIRS.reduce(
            (s, pair) => replaceAll(s, pair[0], pair[1]),
            string
        );
    }

}

function replaceAll(string: string, fromStr: string, toStr: string) {
    return string.split(fromStr).join(toStr);
}
