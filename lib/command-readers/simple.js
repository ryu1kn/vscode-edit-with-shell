
class SimpleCommandReader {

    constructor(params) {
        this._vsWindow = params.vsWindow;
    }

    read() {
        return this._vsWindow.showInputBox();
    }

}

module.exports = SimpleCommandReader;
