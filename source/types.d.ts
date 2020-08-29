import OptionsSync from "webext-options-sync";
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

export type ErrValTuple = [any, Error | null];

export interface IOptions {
    url: string;
    username: string;
    password: string;
    is_context_menu_enabled: boolean;
}
