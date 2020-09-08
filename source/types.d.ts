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
    inbox_tiddler_title: string;
    journal_tiddler_title: string;
    journal_tiddler_tags: string;
    is_context_menu_enabled: boolean;
}

export interface ITiddlerDraft {
    tab_id: string;
    draft_id: string;
    url: string;
    title: string;
    tags: string;
    content: string;
    [key: string]: string;
}
