import {AppIntegratorFactory} from './lib/app-integrator-factory';
import {ExecutionContextLike} from './lib/types/vscode';

exports.activate = (context: ExecutionContextLike) => {
    const appIntegrator = new AppIntegratorFactory().create();
    appIntegrator.integrate(context);
};

exports.deactivate = () => {};
