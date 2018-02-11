
const ShellCommandExecContext = require('../../lib/shell-command-exec-context');

describe('ShellCommandExecContext', () => {

    it('has environment variables', () => {
        const execContext = new ShellCommandExecContext({
            process: {
                env: {VAR: '..'}
            }
        });
        expect(execContext.env).to.eql({VAR: '..'});
    });

    it('returns the directory of the current file if currentDirectoryKind is set to "currentFile"', () => {
        const execContext = new ShellCommandExecContext({workspaceAdapter: fakeWorkspaceAdapter('currentFile')});
        expect(execContext.getCwd('DIR/FILE')).to.eql('DIR');
    });

    it('returns user\'s home directory if currentDirectoryKind is set to "currentFile" but not available', () => {
        const execContext = new ShellCommandExecContext({
            process: {
                env: {HOME: 'USER_HOME_DIR'}
            },
            workspaceAdapter: fakeWorkspaceAdapter('currentFile')
        });
        expect(execContext.getCwd()).to.eql('USER_HOME_DIR');
    });

    it('returns project root directory if currentDirectoryKind is set to "workspaceRoot"', () => {
        const execContext = new ShellCommandExecContext({
            workspaceAdapter: fakeWorkspaceAdapter('workspaceRoot', 'PROJECT_ROOT_PATH')
        });
        expect(execContext.getCwd()).to.eql('PROJECT_ROOT_PATH');
    });

    it('returns user\'s home directory if currentDirectoryKind is set to "workspaceRoot" but not available', () => {
        const execContext = new ShellCommandExecContext({
            process: {
                env: {HOME: 'USER_HOME_DIR'}
            },
            workspaceAdapter: fakeWorkspaceAdapter('workspaceRoot')
        });
        expect(execContext.getCwd()).to.eql('USER_HOME_DIR');
    });

    function fakeWorkspaceAdapter(currentDirectoryKind, rootPath) {
        return {
            rootPath,
            getConfig: path => path === 'editWithShell.currentDirectoryKind' && currentDirectoryKind
        };
    }

});
