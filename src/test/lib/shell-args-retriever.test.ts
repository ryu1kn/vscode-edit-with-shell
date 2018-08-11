import {expect, mock, when} from '../helper';

import ShellArgsRetriever from '../../lib/shell-args-retriever';
import Workspace from '../../lib/adapters/workspace';

describe('ShellArgsRetriever', () => {

    const workspaceAdapter = mock(Workspace);
    when(workspaceAdapter.getConfig('editWithShell.shellArgs.linux')).thenReturn(['LINUX_SHELL_ARGS']);
    when(workspaceAdapter.getConfig('editWithShell.shellArgs.osx')).thenReturn(['MACOS_SHELL_ARGS']);
    when(workspaceAdapter.getConfig('editWithShell.shellArgs.windows')).thenReturn(['WINDOWS_SHELL_ARGS']);

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

    function createShellArgsRetriever(platform: string) {
        return new ShellArgsRetriever({workspaceAdapter, platform});
    }

});
