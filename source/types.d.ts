/**
 * types.d.ts
 *
 * Shared type definitions for TiddlyBench
 */
import dayjs from "dayjs";
import OptionsSync from "webext-options-sync";
import { Response } from "superagent";
import {
    EBlockType,
    EContextType,
    EDestinations,
    EDestinationTiddler,
    EDispatchAction,
    EDispatchSource,
    EMessengerAction,
    EMessengerSource,
} from "./enums";

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

export interface IEditTiddlerOptions {
    text: string;
    tabInfo: ITabInfo | undefined;
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

export interface ICustomDestinationTiddler {
    title: string;
    tb_id: string; // md5 hash of the title
}
export interface ICustomDestination {
    tiddler: ICustomDestinationTiddler;
    last_addition_time: number;
}

export interface IContextMenuCache {
    cacheID: string;
    context: string;
    clickData: browser.contextMenus.OnClickData;
    tabData: browser.tabs.Tab | undefined;
}

interface ITabInfo {
    title: string | undefined;
    url: string | undefined;
}

interface ICodeMap {
    [key: string]: string | ((data: IRecodeData) => string);
}

/**
 * Data for the recoder
 */
interface IRecodeData {
    text: string;
    tabInfo?: ITabInfo;
}

interface IBlockTypes {
    [key: EBlockType]: string;
}

export interface IFormOptionsObj {
    [key: string]: string;
}

export type TFormInputOptions = number[] | string[] | IFormOptionsObj;
export interface IFormField {
    type: string;
    label?: string;
    id?: string;
    options?: TFormInputOptions;
    template_id?: string;
}
export interface IFormSection {
    section_icon: string;
    section_title: string;
    section_subheading: string;
    section_notes: string[];
    fields: IFormField[];
}

export type TContextTypes = {
    [key in EContextType]: string;
};

export interface IDispatchPacket {
    text?: string;
    blockType?: string;
    tiddler_id?: string;
    tiddler_title?: string;
    tiddler_tags?: string;
    cache_id?: string;
}
export interface IDispatchOptions {
    action: EDispatchAction;
    destination: EDestinationTiddler;
    context: EContextType;
    source: EDispatchSource;
    packet: IDispatchPacket;
}
