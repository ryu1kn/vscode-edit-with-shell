
const ShellPathResolver = require('../../lib/shell-path-resolver');

describe('ShellPathResolver', () => {

    const config = {
        'terminal.integrated.shell.linux': 'linux_SHELL_PATH',
        'terminal.integrated.shell.osx': 'osx_SHELL_PATH',
        'terminal.integrated.shell.windows': 'windows_SHELL_PATH'
    };
    const workspaceAdapter = {getConfig: path => config[path]};

    it('it returns Linux shell path user specified in their config when run on Linux', () => {
        const shellPathResolver = createShellPathResolver('linux');
        expect(shellPathResolver.resolve()).to.eql('linux_SHELL_PATH');
    });

    it('it returns macOS shell path user specified in their config when run on macOS', () => {
        const shellPathResolver = createShellPathResolver('darwin');
        expect(shellPathResolver.resolve()).to.eql('osx_SHELL_PATH');
    });

    it('it returns Windows shell path user specified in their config when run on Windows', () => {
        const shellPathResolver = createShellPathResolver('win32');
        expect(shellPathResolver.resolve()).to.eql('windows_SHELL_PATH');
    });

    it('it returns Linux shell path user specified in their config when run on other OSs', () => {
        const shellPathResolver = createShellPathResolver('unknown_platform');
        expect(shellPathResolver.resolve()).to.eql('linux_SHELL_PATH');
    });

    function createShellPathResolver(platform) {
        return new ShellPathResolver({workspaceAdapter, platform});
    }

});
