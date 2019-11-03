
export default class CommandExecutionError extends Error {
    constructor(message: string,
                public readonly code: number,
                public readonly command: string,
                public readonly errorOutput: string) {
        super(message);
    }
}
