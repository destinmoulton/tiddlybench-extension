import { EConfigKey } from "../enums";
import { BLOCK_TYPES } from "../constants";
import { IFormSection } from "../types";
const form: IFormSection[] = [
    {
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
        section_title: "Quick Add Settings",
        section_subheading:
            "The Quick Add box allows you to quickly add text to your Inbox or Journal.",
        section_notes: [],
        fields: [
            {
                label: "Quick Add Default Destination",
                id: EConfigKey.QUICKADD_DEFAULT_DESTINATION,
                type: "select",
                options: BLOCK_TYPES,
            },
            {
                label: "Quick Addd Default Block Type",
                id: EConfigKey.TIDDLER_JOURNAL_TITLE,
                type: "text",
                options: {
                    journal: "Journal",
                    inbox: "Inbox",
                },
            },
        ],
    },
    {
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
];

export default form;
