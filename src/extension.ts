'use strict';

import AppIntegratorFactory from './lib/app-integrator-factory';

exports.activate = context => {
    const appIntegrator = new AppIntegratorFactory().create();
    appIntegrator.integrate(context);
};

exports.deactivate = () => {};
