import {ProcessRunner} from './process-runner';
import {ShellCommandExecContext} from './shell-command-exec-context';
import {ShellSettingsResolver} from './shell-settings-resolver';
import {ChildProcess, SpawnOptions} from 'child_process';
import {Workspace} from './adapters/workspace';
import Process = NodeJS.Process;
import { ObjectMap } from './types/collection';

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
        // Why Proxy Object?
        const shellEnv = this.shellSettingsResolver.shellEnv();
        const pathSeparator = this.shellSettingsResolver.pathSeparator();
        const system_env_path = options.env.Path || options.env.PATH;
        const env_path = shellEnv.Path || shellEnv.PATH;
        const env:ObjectMap<string> = {};

        // linux&win use 'PATH'
        options.env.PATH = options.env.Path;
        delete options.env.Path;
        // Can't delete member
        // delete shellEnv.Path
        // delete shellEnv.PATH

        // skip env:Path
        for (let key in shellEnv){
            if(key.toUpperCase() != "PATH"){
                env[key] = shellEnv[key]
            }
        }

        Object.assign(options.env, env)

        if(env_path) {
            options.env.PATH = env_path + pathSeparator + system_env_path;
        }

        const command = this.childProcess.spawn(shell, [...shellArgs, params.command], options);
        return this.processRunner.run(command, params.input);
    }

    private getOptions(params: CommandParams) {
        return {
            cwd: this.shellCommandExecContext.getCwd(params.filePath),
            env: {
                ...this.shellCommandExecContext.env,
                ES_SELECTED: params.input
            } as ObjectMap<string>
        };
    }
}
