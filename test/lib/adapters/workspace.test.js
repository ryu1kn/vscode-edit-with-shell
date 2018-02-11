
const WorkspaceAdapter = require('../../../lib/adapters/workspace');

describe('WorkspaceAdapter', () => {

    it('gets config value of specified 2 level path', () => {
        const workspaceAdapter = new WorkspaceAdapter({vsWorkspace: fakeVscodeWorkspace()});
        expect(workspaceAdapter.getConfig('A.B')).to.eql('VALUE1');
    });

    it('gets config value of specified 4 level path', () => {
        const workspaceAdapter = new WorkspaceAdapter({vsWorkspace: fakeVscodeWorkspace()});
        expect(workspaceAdapter.getConfig('C.D.E.F')).to.eql('VALUE2');
    });

    function fakeVscodeWorkspace() {
        const config = {
            'A.B': 'VALUE1',
            'C.D.E.F': 'VALUE2'
        };
        return {
            getConfiguration: oneAbove => {
                switch (oneAbove) {
                case 'A':
                    return {get: name => config[`A.${name}`]};
                case 'C.D.E':
                    return {get: name => config[`C.D.E.${name}`]};
                default:
                    return {get: () => {}};
                }
            }
        };
    }

});
