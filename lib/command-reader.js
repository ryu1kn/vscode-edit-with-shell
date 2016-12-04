
class CommandReader {

    constructor(params) {
        this._vsWindow = params.vsWindow;
    }

    read() {
        return this._vsWindow.showInputBox();
    }

}

module.exports = CommandReader;
