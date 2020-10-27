import { EConfigKey } from "../enums";
import { BLOCK_TYPES } from "../constants";
import { IFormSection } from "../types";
const form: IFormSection[] = [
    {
        section_icon: "jam jam-database",
        section_title: "TiddlyWiki Connection Settings",
        section_subheading: "The settings for your TiddlyWiki server.",
        section_notes: [
            "IMPORTANT: If a 'Sign In' popup window appears click Cancel.",
        ],
        fields: [
            {
                label: "TiddlyWiki Server URL",
                id: EConfigKey.SERVER_URL,
                type: "text",
            },
            {
                label: "TiddlyWiki Username",
                id: EConfigKey.SERVER_USERNAME,
                type: "text",
            },
            {
                label: "TiddlyWiki Password",
                id: EConfigKey.SERVER_PASSWORD,
                type: "password",
            },
            {
                type: "template",
                template_id: "tmpl-server-settings-extras",
            },
        ],
    },
    {
        section_icon: "jam jam-inboxes",
        section_title: "Inbox and Journal Tiddler Settings",
        section_subheading: "",
        section_notes: [
            "You can use formatting codes to add dates and times to the Inbox or Journal titles.",
        ],
        fields: [
            {
                label: "Inbox Tiddler Title",
                id: EConfigKey.TIDDLER_INBOX_TITLE,
                type: "text",
            },
            {
                label: "Journal Tiddler Title",
                id: EConfigKey.TIDDLER_JOURNAL_TITLE,
                type: "text",
            },
            {
                label: "Journal Tiddler Default Tags",
                id: EConfigKey.TIDDLER_JOURNAL_TAGS,
                type: "text",
            },
        ],
    },
    {
        section_icon: "jam ",
        section_title: "Block Settings",
        section_subheading:
            "Blocks are used to wrap text that you add to a tiddler.",
        section_notes: [
            "You can use {[BR]} to add line breaks, {[SP]} to add spaces, {[Link]} to add a TiddlyWiki markdown link.",
        ],
        fields: [
            {
                label: "Quote Block Prefix",
                id: EConfigKey.BLOCK_QUOTE_PREFIX,
                type: "text",
            },
            {
                label: "Quote Block Suffix",
                id: EConfigKey.BLOCK_QUOTE_SUFFIX,
                type: "text",
            },
            {
                label: "Code Block Prefix",
                id: EConfigKey.BLOCK_CODE_PREFIX,
                type: "text",
            },
            {
                label: "Code Block Suffix",
                id: EConfigKey.BLOCK_CODE_SUFFIX,
                type: "text",
            },
            {
                label: "Paragraph Block Prefix",
                id: EConfigKey.BLOCK_PARAGRAPH_PREFIX,
                type: "text",
            },
            {
                label: "Paragraph Block Suffix",
                id: EConfigKey.BLOCK_PARAGRAPH_SUFFIX,
                type: "text",
            },
            {
                label: "Unordered List Item Prefix",
                id: EConfigKey.BLOCK_ULITEM_PREFIX,
                type: "text",
            },
            {
                label: "Unordered List Item Suffix",
                id: EConfigKey.BLOCK_ULITEM_SUFFIX,
                type: "text",
            },
            {
                label: "Numbered List Item Prefix",
                id: EConfigKey.BLOCK_OLITEM_PREFIX,
                type: "text",
            },
            {
                label: "Numbered List Item Suffix",
                id: EConfigKey.BLOCK_OLITEM_SUFFIX,
                type: "text",
            },
        ],
    },
    {
        section_icon: "jam jam-plus-rectangle",
        section_title: "Quick Add Settings",
        section_subheading:
            "The Quick Add box allows you to quickly add text to your Inbox or Journal.",
        section_notes: [
            "The Default Destination and Default Block Type determine what is selected in the dropdowns below the Quick Add text box in the popup when you click the TiddlyBench icon in the browser toolbar.",
        ],
        fields: [
            {
                label: "Quick Add Default Destination",
                id: EConfigKey.QUICKADD_DEFAULT_DESTINATION,
                type: "select",
                options: {
                    journal: "Journal",
                    inbox: "Inbox",
                },
            },
            {
                label: "Quick Add Default Block Type",
                id: EConfigKey.QUICKADD_DEFAULT_BLOCKTYPE,
                type: "select",
                options: BLOCK_TYPES,
            },
        ],
    },
    {
        section_icon: "jam jam-menu",
        section_title: "Context Menu Settings",
        section_subheading:
            "Right clicking on a page or selection shows the TiddlyBench context menu.",
        section_notes: [],
        fields: [
            {
                label:
                    "Number of custom destination tiddlers available in context menu?",
                id: EConfigKey.CONTEXTMENU_NUM_CUSTOM_DESTINATIONS,
                type: "select",
                options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            },
        ],
    },
    {
        section_icon: "jam jam-bookmark",
        section_title: "Bookmark Settings",
        section_subheading:
            "Bookmarks can be added via right clicking on a page with nothing selected.",
        section_notes: [
            "You can use {[BR]} to add line breaks, {[SP]} to add spaces, {[Link]} to add a TiddlyWiki markdown link.",
        ],
        fields: [
            {
                label: "Bookmark Prefix",
                id: EConfigKey.BOOKMARK_PREFIX,
                type: "text",
            },
            {
                label: "Bookmark Markdown",
                id: EConfigKey.BOOKMARK_MARKDOWN,
                type: "text",
            },
            {
                label: "Bookmark Suffix",
                id: EConfigKey.BOOKMARK_SUFFIX,
                type: "text",
            },
        ],
    },
];

export default form;
