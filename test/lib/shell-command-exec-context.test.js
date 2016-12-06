
const ShellCommandExecContext = require('../../lib/shell-command-exec-context');

describe('ShellCommandExecContext', () => {

    it('has environment variables', () => {
        const execContext = new ShellCommandExecContext({
            process: {
                env: {
                    HOME: 'USER_HOME_DIR',
                    OTHER_VARS: '..'
                }
            }
        });
        expect(execContext.env).to.eql({
            HOME: 'USER_HOME_DIR',
            OTHER_VARS: '..'
        });
    });

    it("returns project root directory as command's current working directory", () => {
        const execContext = new ShellCommandExecContext({
            vsWorkspace: {
                rootPath: 'PROJECT_ROOT_PATH'
            }
        });
        expect(execContext.cwd).to.eql('PROJECT_ROOT_PATH');
    });

    it("returns user's home directory as command's current working directory if project root is not available", () => {
        const execContext = new ShellCommandExecContext({
            process: {
                env: {HOME: 'USER_HOME_DIR'}
            },
            vsWorkspace: {}
        });
        expect(execContext.cwd).to.eql('USER_HOME_DIR');
    });

});
