import * as assert from 'assert';
import {mock, when} from '../helper';

import {ShellSettingsResolver} from '../../lib/shell-settings-resolver';
import {Workspace} from '../../lib/adapters/workspace';

describe('ShellSettingsResolver', () => {

    const workspaceAdapter = mock(Workspace);
    when(workspaceAdapter.getConfig('editWithShell.shell.linux')).thenReturn('linux_SHELL_PATH');
    when(workspaceAdapter.getConfig('editWithShell.shell.osx')).thenReturn('osx_SHELL_PATH');
    when(workspaceAdapter.getConfig('editWithShell.shell.windows')).thenReturn('windows_SHELL_PATH');
    when(workspaceAdapter.getConfig('editWithShell.shellArgs.linux')).thenReturn(['LINUX_SHELL_ARGS']);
    when(workspaceAdapter.getConfig('editWithShell.shellArgs.osx')).thenReturn(['MACOS_SHELL_ARGS']);
    when(workspaceAdapter.getConfig('editWithShell.shellArgs.windows')).thenReturn(['WINDOWS_SHELL_ARGS']);

    it('it returns Linux shell args user specified in their config when run on Linux', () => {
        const shellArgsRetriever = createShellSettingsResolver('linux');
        assert.deepStrictEqual(shellArgsRetriever.shellArgs(), ['LINUX_SHELL_ARGS']);
    });

    it('it returns macOS shell args user specified in their config when run on macOS', () => {
        const shellArgsRetriever = createShellSettingsResolver('darwin');
        assert.deepStrictEqual(shellArgsRetriever.shellArgs(), ['MACOS_SHELL_ARGS']);
    });

    it('it returns Windows shell args user specified in their config when run on Windows', () => {
        const shellArgsRetriever = createShellSettingsResolver('win32');
        assert.deepStrictEqual(shellArgsRetriever.shellArgs(), ['WINDOWS_SHELL_ARGS']);
    });

    it('it returns Linux shell args user specified in their config when run on other OSs', () => {
        const shellArgsRetriever = createShellSettingsResolver('unknown_platform');
        assert.deepStrictEqual(shellArgsRetriever.shellArgs(), ['LINUX_SHELL_ARGS']);
    });

    it('it returns Linux shell path user specified in their config when run on Linux', () => {
        const shellProgrammeResolver = createShellSettingsResolver('linux');
        assert.deepStrictEqual(shellProgrammeResolver.shellProgramme(), 'linux_SHELL_PATH');
    });

    it('it returns macOS shell path user specified in their config when run on macOS', () => {
        const shellProgrammeResolver = createShellSettingsResolver('darwin');
        assert.deepStrictEqual(shellProgrammeResolver.shellProgramme(), 'osx_SHELL_PATH');
    });

    it('it returns Windows shell path user specified in their config when run on Windows', () => {
        const shellProgrammeResolver = createShellSettingsResolver('win32');
        assert.deepStrictEqual(shellProgrammeResolver.shellProgramme(), 'windows_SHELL_PATH');
    });

    it('it returns Linux shell path user specified in their config when run on other OSs', () => {
        const shellProgrammeResolver = createShellSettingsResolver('unknown_platform');
        assert.deepStrictEqual(shellProgrammeResolver.shellProgramme(), 'linux_SHELL_PATH');
    });

    function createShellSettingsResolver(platform: string) {
        return new ShellSettingsResolver(workspaceAdapter, platform);
    }
});
