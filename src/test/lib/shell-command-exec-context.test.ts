import * as assert from 'assert';
import {mockMethods, mockType, when} from '../helper';

import {ShellCommandExecContext} from '../../lib/shell-command-exec-context';
import {Workspace} from '../../lib/adapters/workspace';

describe('ShellCommandExecContext', () => {

    it('has environment variables', () => {
        const workspace = mockType<Workspace>();
        const execContext = new ShellCommandExecContext(workspace, {env: {VAR: '..'}});
        assert.deepStrictEqual(execContext.env, {VAR: '..'});
    });

    it('returns the directory of the current file if currentDirectoryKind is set to "currentFile"', () => {
        const execContext = new ShellCommandExecContext(fakeWorkspaceAdapter('currentFile'), {env: {}});
        assert.deepStrictEqual(execContext.getCwd('DIR/FILE'), 'DIR');
    });

    it('returns user\'s home directory if currentDirectoryKind is set to "currentFile" but not available', () => {
        const execContext = new ShellCommandExecContext(fakeWorkspaceAdapter('currentFile'), {env: {HOME: 'USER_HOME_DIR'}});
        assert.deepStrictEqual(execContext.getCwd(), 'USER_HOME_DIR');
    });

    it('returns project root directory if currentDirectoryKind is set to "workspaceRoot"', () => {
        const execContext = new ShellCommandExecContext(fakeWorkspaceAdapter('workspaceRoot', 'PROJECT_ROOT_PATH'), {env: {}});
        assert.deepStrictEqual(execContext.getCwd(), 'PROJECT_ROOT_PATH');
    });

    it('returns user\'s home directory if currentDirectoryKind is set to "workspaceRoot" but not available', () => {
        const execContext = new ShellCommandExecContext(fakeWorkspaceAdapter('workspaceRoot'), {env: {HOME: 'USER_HOME_DIR'}});
        assert.deepStrictEqual(execContext.getCwd(), 'USER_HOME_DIR');
    });

    function fakeWorkspaceAdapter(currentDirectoryKind: string, rootPath?: string) {
        const workspace = mockMethods<Workspace>(['getConfig'], {rootPath});
        when(workspace.getConfig('editWithShell.currentDirectoryKind')).thenReturn(currentDirectoryKind);
        return workspace;
    }

});
