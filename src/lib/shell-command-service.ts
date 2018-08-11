import ProcessRunner from './process-runner';
import ShellCommandExecContext from './shell-command-exec-context';
import ShellProgrammeResolver from './shell-programme-resolver';
import ShellArgsRetriever from './shell-args-retriever';
import {ChildProcess, SpawnOptions} from 'child_process';

export interface SpawnWrapper {
    spawn: (command: string, args?: ReadonlyArray<string>, options?: SpawnOptions) => ChildProcess;
}

export interface CommandParams {
    command: string;
    input: string;
    filePath?: string;
}

export default class ShellCommandService {
    private readonly _childProcess: SpawnWrapper;
    private readonly _processRunner: ProcessRunner;
    private readonly _shellCommandExecContext: ShellCommandExecContext;
    private readonly _shellProgrammeResolver: ShellProgrammeResolver;
    private readonly _shellArgsRetriever: ShellArgsRetriever;

    constructor(processRunner: ProcessRunner,
                shellProgrammeResolver: ShellProgrammeResolver,
                shellArgsRetriever: ShellArgsRetriever,
                shellCommandExecContext: ShellCommandExecContext,
                childProcess: SpawnWrapper) {
        this._childProcess = childProcess;
        this._processRunner = processRunner;
        this._shellCommandExecContext = shellCommandExecContext;
        this._shellProgrammeResolver = shellProgrammeResolver;
        this._shellArgsRetriever = shellArgsRetriever;
    }

    runCommand(params: CommandParams): Promise<string> {
        const options = this._getOptions(params.filePath);
        const shell = this._shellProgrammeResolver.resolve();
        const shellArgs = this._shellArgsRetriever.retrieve();
        const command = this._childProcess.spawn(shell, [...shellArgs, params.command], options);
        return this._processRunner.run(command, params.input);
    }

    _getOptions(filePath?: string) {
        return {
            cwd: this._shellCommandExecContext.getCwd(filePath),
            env: this._shellCommandExecContext.env
        };
    }

}
