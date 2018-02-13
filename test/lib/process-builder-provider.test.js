
const ProcessBuilderProvider = require('../../lib/process-builder-provider');

describe('ProcessBuilderProvider', () => {

    it('provides custom shell process builder', () => {
        const shellProgrammeResolver = {resolve: () => 'SHELL_PROGRAMME'};
        const processBuilder = createProcessBuilder(shellProgrammeResolver);
        expect(processBuilder).to.eql('CUSTOM_PROCESS_BUILDER');
    });

    it('provides default shell process builder if shell programme is not specified', () => {
        const shellProgrammeResolver = {resolve: () => ''};
        const processBuilder = createProcessBuilder(shellProgrammeResolver);
        expect(processBuilder).to.eql('DEFAULT_PROCESS_BUILDER');
    });

    function createProcessBuilder(shellProgrammeResolver) {
        const customProcessBuilder = 'CUSTOM_PROCESS_BUILDER';
        const defaultProcessBuilder = 'DEFAULT_PROCESS_BUILDER';
        const provider = new ProcessBuilderProvider({
            customProcessBuilder,
            defaultProcessBuilder,
            shellProgrammeResolver
        });
        return provider.provide();
    }
});
