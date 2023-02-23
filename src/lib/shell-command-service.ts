import {ProcessRunner} from './process-runner';
import {ShellCommandExecContext} from './shell-command-exec-context';
import {ShellSettingsResolver} from './shell-settings-resolver';
import {ChildProcess, SpawnOptions} from 'child_process';
import {Workspace} from './adapters/workspace';
import Process = NodeJS.Process;

export interface SpawnWrapper {
    spawn: (command: string, args?: ReadonlyArray<string>, options?: SpawnOptions) => ChildProcess;
}

export interface CommandParams {
    command: string;
    input: string;
    filePath?: string;
}

export class ShellCommandService {
    private readonly shellCommandExecContext: ShellCommandExecContext;
    private readonly shellSettingsResolver: ShellSettingsResolver;

    constructor(private readonly processRunner: ProcessRunner,
                workspace: Workspace,
                process: Process,
                private readonly childProcess: SpawnWrapper) {
        this.shellCommandExecContext = new ShellCommandExecContext(workspace, {env: process.env});
        this.shellSettingsResolver = new ShellSettingsResolver(workspace, process.platform);
    }

    runCommand(params: CommandParams): Promise<string> {
        const options = this.getOptions(params);
        const shell = this.shellSettingsResolver.shellProgramme();
        const shellArgs = this.shellSettingsResolver.shellArgs();
        const command = this.childProcess.spawn(shell, [...shellArgs, params.command], options);
        return this.processRunner.run(command, params.input);
    }

    private getOptions(params: CommandParams) {
        return {
            cwd: this.shellCommandExecContext.getCwd(params.filePath),
            env: {
                ...this.shellCommandExecContext.env,
                ES_SELECTED: params.input,
                ES_FILEPATH: params.filePath
            }
        };
    }
}
