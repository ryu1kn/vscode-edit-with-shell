
const chai = require('chai');
chai.use(require('sinon-chai'));

global.expect = chai.expect;
global.sinon = require('sinon');

global.throwError = () => {
    throw new Error('Should not have been called');
};

// stubWithArgs([arg11, arg12, ...], return1, [arg21, ...], return2)
global.stubWithArgs = function () {
    'use strict';

    const args = Array.prototype.slice.call(arguments);
    const stub = sinon.stub();
    for (let i = 0; i + 1 < args.length; i += 2) {
        stub.withArgs.apply(stub, args[i]).returns(args[i + 1]);
    }
    return stub;
};

// stubReturns(return1, return2, ...)
global.stubReturns = function () {
    const args = Array.prototype.slice.call(arguments);
    return args.reduce((stub, arg, index) => {
        stub.onCall(index).returns(arg);
        return stub;
    }, sinon.stub());
};
