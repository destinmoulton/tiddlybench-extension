import { EBlockType } from "./enums";
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
