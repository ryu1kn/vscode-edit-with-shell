
class ProcessBuilderProvider {

    constructor(params) {
        this._customProcessBuilder = params.customProcessBuilder;
        this._defaultProcessBuilder = params.defaultProcessBuilder;
        this._shellProgrammeResolver = params.shellProgrammeResolver;
    }

    provide() {
        return this._useCustomShell ? this._customProcessBuilder : this._defaultProcessBuilder;
    }

    get _useCustomShell() {
        return this._shellProgrammeResolver.resolve() !== '';
    }

}

module.exports = ProcessBuilderProvider;
