import OptionsSync from "webext-options-sync";

// The tiddler that is returned by get calls
export interface ITiddlerItem {
    created: string;
    creator: string;
    modified: string;
    modifier: string;
    revision: number;
    title: string;
    type: string;
}

// A full tiddler
// Defined at: https://tiddlywiki.com/prerelease/static/TiddlyWeb%2520JSON%2520tiddler%2520format.html
export interface IFullTiddler {
    title: string;
    text: string;
    tags?: string;
    bag?: string;
    created?: string;
    creator?: string;
    modified?: string;
    modifier?: string;
    permissions?: string;
    recipe?: string;
    revision?: string;
    type?: string;
    uri?: string;
    [key: string]: string;
}

export interface API_Result {
    ok: boolean;
    message?: string;
    data?: ITiddlerItem[] | IFullTiddler;
    status?: number;
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

interface IFormatMap {
    [key: string]: string;
}
