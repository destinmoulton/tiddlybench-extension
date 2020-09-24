/**
 * Tiddler Sources
 */
export enum ETiddlerSource {
    FromUnknown,
    FromContextMenu,
    FromQuickAdd,
}

/**
 * Extension URLS
 */
export enum EExtensionURL {
    Popup,
    Settings,
    ChooseTiddler,
}

/**
 * Context Menu Block Types
 */
export enum EContextMenuBlockType {
    QUOTE = "quote",
    CODE = "code",
    PARAGRAPH = "paragraph",
    ULITEM = "unordered_list_item",
    OLITEM = "ordered_list_item",
}

/**
 * Context Menu Storage Keys
 */
export enum EContextMenuStorageKeys {
    DESTINATIONS = "destinations",
    SELECTION_CACHE = "selection_cache",
    SELECTED_BLOCK_TYPE = "selected_block_type",
}
