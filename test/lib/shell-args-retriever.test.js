
const ShellArgsRetriever = require('../../lib/shell-args-retriever');

describe('ShellArgsRetriever', () => {

    const config = {
        'editWithShell.shellArgs.linux': ['LINUX_SHELL_ARGS'],
        'editWithShell.shellArgs.osx': ['MACOS_SHELL_ARGS'],
        'editWithShell.shellArgs.windows': ['WINDOWS_SHELL_ARGS']
    };
    const workspaceAdapter = {getConfig: path => config[path]};

    it('it returns Linux shell args user specified in their config when run on Linux', () => {
        const shellArgsRetriever = createShellArgsRetriever('linux');
        expect(shellArgsRetriever.retrieve()).to.eql(['LINUX_SHELL_ARGS']);
    });

    it('it returns macOS shell args user specified in their config when run on macOS', () => {
        const shellArgsRetriever = createShellArgsRetriever('darwin');
        expect(shellArgsRetriever.retrieve()).to.eql(['MACOS_SHELL_ARGS']);
    });

    it('it returns Windows shell args user specified in their config when run on Windows', () => {
        const shellArgsRetriever = createShellArgsRetriever('win32');
        expect(shellArgsRetriever.retrieve()).to.eql(['WINDOWS_SHELL_ARGS']);
    });

    it('it returns Linux shell args user specified in their config when run on other OSs', () => {
        const shellArgsRetriever = createShellArgsRetriever('unknown_platform');
        expect(shellArgsRetriever.retrieve()).to.eql(['LINUX_SHELL_ARGS']);
    });

    function createShellArgsRetriever(platform) {
        return new ShellArgsRetriever({workspaceAdapter, platform});
    }

});
