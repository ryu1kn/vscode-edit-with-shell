import * as assert from 'assert';
import {mock, when} from '../helper';

import ShellArgsRetriever from '../../lib/shell-args-retriever';
import Workspace from '../../lib/adapters/workspace';

describe('ShellArgsRetriever', () => {

    const workspaceAdapter = mock(Workspace);
    when(workspaceAdapter.getConfig('editWithShell.shellArgs.linux')).thenReturn(['LINUX_SHELL_ARGS']);
    when(workspaceAdapter.getConfig('editWithShell.shellArgs.osx')).thenReturn(['MACOS_SHELL_ARGS']);
    when(workspaceAdapter.getConfig('editWithShell.shellArgs.windows')).thenReturn(['WINDOWS_SHELL_ARGS']);

    it('it returns Linux shell args user specified in their config when run on Linux', () => {
        const shellArgsRetriever = createShellArgsRetriever('linux');
        assert.deepEqual(shellArgsRetriever.retrieve(), ['LINUX_SHELL_ARGS']);
    });

    it('it returns macOS shell args user specified in their config when run on macOS', () => {
        const shellArgsRetriever = createShellArgsRetriever('darwin');
        assert.deepEqual(shellArgsRetriever.retrieve(), ['MACOS_SHELL_ARGS']);
    });

    it('it returns Windows shell args user specified in their config when run on Windows', () => {
        const shellArgsRetriever = createShellArgsRetriever('win32');
        assert.deepEqual(shellArgsRetriever.retrieve(), ['WINDOWS_SHELL_ARGS']);
    });

    it('it returns Linux shell args user specified in their config when run on other OSs', () => {
        const shellArgsRetriever = createShellArgsRetriever('unknown_platform');
        assert.deepEqual(shellArgsRetriever.retrieve(), ['LINUX_SHELL_ARGS']);
    });

    function createShellArgsRetriever(platform: string) {
        return new ShellArgsRetriever({workspaceAdapter, platform});
    }

});
