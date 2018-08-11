import {ChildProcess} from 'child_process';
import CommandExecutionError from './errors/command';

export default class ProcessRunner {

    run(command: ChildProcess, inputString: string): Promise<string> {
        let stdoutString = '';
        let stderrString = '';

        command.stdin.write(inputString);
        command.stdin.end();

        command.stdout.on('data', data => {
            stdoutString += data.toString();
        });
        command.stderr.on('data', data => {
            stderrString += data.toString();
        });

        return new Promise((resolve, reject) => {
            command.on('error', err => {
                reject(err);
            });
            command.on('close', code => {
                if (code !== 0) {
                    // @ts-ignore `spawnargs` is not declared on ChildProcess class. Private property?
                    const commandString = command.spawnargs.slice(-1)[0];
                    reject(
                        new CommandExecutionError(`Command failed: ${commandString}\n${stderrString}`,
                            code,
                            commandString,
                            stderrString.trim()
                        )
                    );
                } else {
                    resolve(stdoutString);
                }
            });
        });
    }

}
