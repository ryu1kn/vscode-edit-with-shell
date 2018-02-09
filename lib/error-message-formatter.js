
class ErrorMessageFormatter {

    format(message) {
        const trimmedMessage = (message || '').trim();
        return replaceAll(trimmedMessage, '\n', '\\n');
    }

}

function replaceAll(string, fromStr, toStr) {
    return string.split(fromStr).join(toStr);
}

module.exports = ErrorMessageFormatter;
