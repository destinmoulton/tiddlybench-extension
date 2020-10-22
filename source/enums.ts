/**
 * Extension URLS
 */
export enum EExtensionURL {
    Popup,
    Settings,
    ChooseTiddler,
    TiddlerForm,
}

/**
 * Context Menu Block Types
 */
export enum EBlockType {
    QUOTE = "quote",
    CODE = "code",
    PARAGRAPH = "paragraph",
    ULITEM = "ulitem",
    OLITEM = "olitem",
}

/**
 * Context Menu Storage Keys
 */
export enum EContextMenuStorageKeys {
    DESTINATIONS = "destinations",
    CACHE = "cache",
    SELECTED_BLOCK_TYPE = "selected_block_type",
}

/**
 * Config Storage Keys
 */
export enum EConfigKey {
    SERVER_URL = "server_url",
    SERVER_USERNAME = "server_username",
    SERVER_PASSWORD = "server_password",
    TIDDLER_INBOX_TITLE = "tiddler_inbox_title",
    TIDDLER_JOURNAL_TITLE = "tiddler_journal_title",
    TIDDLER_JOURNAL_TAGS = "tiddler_journal_tags",
    BOOKMARK_TIDDLER_TITLE = "bookmark_tiddler_title",
    BOOKMARK_PREFIX = "bookmark_prefix",
    BOOKMARK_MARKDOWN = "bookmark_markdown",
    BOOKMARK_SUFFIX = "bookmark_suffix",
    BLOCK_QUOTE_PREFIX = "block_quote_prefix",
    BLOCK_QUOTE_SUFFIX = "block_quote_suffix",
    BLOCK_CODE_PREFIX = "block_code_prefix",
    BLOCK_CODE_SUFFIX = "block_code_suffix",
    BLOCK_PARAGRAPH_PREFIX = "block_paragraph_prefix",
    BLOCK_PARAGRAPH_SUFFIX = "block_paragraph_suffix",
    BLOCK_ULITEM_PREFIX = "block_ulitem_prefix",
    BLOCK_ULITEM_SUFFIX = "block_ulitem_suffix",
    BLOCK_OLITEM_PREFIX = "block_olitem_prefix",
    BLOCK_OLITEM_SUFFIX = "block_olitem_suffix",
    CONTEXTMENU_NUM_CUSTOM_DESTINATIONS = "contextmenu_num_custom_destinations",
    QUICKADD_DEFAULT_DESTINATION = "quickadd_default_destination",
    QUICKADD_DEFAULT_BLOCKTYPE = "quickadd_default_blocktype",
}

export enum EContextType {
    LINK = "link",
    PAGE = "page",
    SELECTION = "selection",
    TAB = "tab", // This is when you click on a tab
}

export enum EDestinationTiddler {
    NONE = "",
    BOOKMARKS = "bookmarks",
    INBOX = "inbox",
    JOURNAL = "journal",
    CUSTOM = "custom",
}

export enum EDispatchAction {
    ADD_TEXT_TO_TIDDLER = "add_text_to_tiddler",
    ADD_TIDDLER_WITH_TEXT = "add_tiddler_with_text",
    CHANGE_BLOCKTYPE = "change_blocktype",
    CHOOSE_CUSTOM_DESTINATION = "choose_custom_destination",
}

export enum EDispatchSource {
    QUICKADD = "messenger",
    TAB = "tab",
    CONTEXTMENU = "contextmenu",
}
