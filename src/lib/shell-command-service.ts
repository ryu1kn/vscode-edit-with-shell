import ProcessRunner from './process-runner';
import ShellCommandExecContext from './shell-command-exec-context';
import ShellProgrammeResolver from './shell-programme-resolver';
import ShellArgsRetriever from './shell-args-retriever';
import {ChildProcess, SpawnOptions} from 'child_process';
import Workspace from './adapters/workspace';
import Process = NodeJS.Process;

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
                workspace: Workspace,
                process: Process,
                childProcess: SpawnWrapper) {
        this.childProcess = childProcess;
        this.processRunner = processRunner;
        this.shellCommandExecContext = new ShellCommandExecContext(workspace, {env: process.env});
        this.shellProgrammeResolver = new ShellProgrammeResolver(workspace, process.platform);
        this.shellArgsRetriever = new ShellArgsRetriever(workspace, process.platform);
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
