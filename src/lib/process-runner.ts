
export default class ProcessRunner {

    run(command, inputString) {
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
                    const commandString = command.spawnargs.slice(-1)[0];
                    reject(Object.assign(
                        new Error(`Command failed: ${commandString}\n${stderrString}`),
                        {
                            cmd: commandString,
                            code,
                            errorOutput: stderrString.trim()
                        }
                    ));
                } else {
                    resolve(stdoutString);
                }
            });
        });
    }

}
