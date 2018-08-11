
export interface ExecutionContextLike {
    subscriptions: any[];
}

export interface PositionLike {
    line: number;
    character: number;
}

export interface RangeLike {
    start: PositionLike;
    end: PositionLike;
}

export type ShowErrorMessage = (message: string) => Thenable<string | undefined>;
