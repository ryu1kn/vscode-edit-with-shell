
export default class CommandExecutionError extends Error {
    public readonly code: number;
    public readonly command: string;
    public readonly errorOutput: string;

    constructor(message: string, code: number, command: string, errorOutput: string) {
        super(message);
        this.code = code;
        this.command = command;
        this.errorOutput = errorOutput;
    }

}
