import { EBlockType, EContextType, EQuickAddDestinations } from "./enums";
import { TContextTypes } from "./types";
/**
 * Define the available block types
 */
export const BLOCK_TYPES = {
    [EBlockType.QUOTE]: "Quotation Block",
    [EBlockType.CODE]: "Code Block",
    [EBlockType.PARAGRAPH]: "Paragraph",
    [EBlockType.ULITEM]: "Unordered List Item",
    [EBlockType.OLITEM]: "Ordered List Item",
};

export const QUICK_ADD_DESTINATIONS = {
    [EQuickAddDestinations.INBOX]: "Inbox",
    [EQuickAddDestinations.JOURNAL]: "Journal",
};

export const CONTEXT_TYPE_TITLES: TContextTypes = {
    [EContextType.LINK]: "Link",
    [EContextType.PAGE]: "Page Bookmark",
    [EContextType.SELECTION]: "Selection",
    [EContextType.TAB]: "Tab",
};
