export interface Tiddler {
    created: string;
    creator: string;
    modified: string;
    modifier: string;
    revision: number;
    title: string;
    type: string;
}

export interface API_Result {
    ok: boolean;
    message?: string;
    data?: Tiddler[];
    response?: Response;
}
