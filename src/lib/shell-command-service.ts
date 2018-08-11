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
    private readonly childProcess: SpawnWrapper;
    private readonly processRunner: ProcessRunner;
    private readonly shellCommandExecContext: ShellCommandExecContext;
    private readonly shellProgrammeResolver: ShellProgrammeResolver;
    private readonly shellArgsRetriever: ShellArgsRetriever;

    constructor(processRunner: ProcessRunner,
                shellProgrammeResolver: ShellProgrammeResolver,
                shellArgsRetriever: ShellArgsRetriever,
                shellCommandExecContext: ShellCommandExecContext,
                childProcess: SpawnWrapper) {
        this.childProcess = childProcess;
        this.processRunner = processRunner;
        this.shellCommandExecContext = shellCommandExecContext;
        this.shellProgrammeResolver = shellProgrammeResolver;
        this.shellArgsRetriever = shellArgsRetriever;
    }

    runCommand(params: CommandParams): Promise<string> {
        const options = this.getOptions(params.filePath);
        const shell = this.shellProgrammeResolver.resolve();
        const shellArgs = this.shellArgsRetriever.retrieve();
        const command = this.childProcess.spawn(shell, [...shellArgs, params.command], options);
        return this.processRunner.run(command, params.input);
    }

    private getOptions(filePath?: string) {
        return {
            cwd: this.shellCommandExecContext.getCwd(filePath),
            env: this.shellCommandExecContext.env
        };
    }

}
