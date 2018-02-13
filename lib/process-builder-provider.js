
class ProcessBuilderProvider {

    constructor(params) {
        this._customShellProcessBuilder = params.customShellProcessBuilder;
        this._defaultShellProcessBuilder = params.defaultShellProcessBuilder;
        this._shellProgrammeResolver = params.shellProgrammeResolver;
    }

    provide() {
        return this._useCustomShell ?
            this._customShellProcessBuilder : this._defaultShellProcessBuilder;
    }

    get _useCustomShell() {
        return this._shellProgrammeResolver.resolve() !== '';
    }

}

module.exports = ProcessBuilderProvider;
