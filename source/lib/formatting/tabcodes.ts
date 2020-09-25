import { replace } from "lodash";
/**
 * tabcodes.ts
 *
 * The conversion codes/functions
 * for browser tab data (title, url, link)
 */

import { ITabInfo } from "../../types";
const TAB_CODES = {
    LINK: (tabInfo: ITabInfo) => {
        let replacement = "";
        if (tabInfo.url && tabInfo.url !== "") {
            if (tabInfo.title && tabInfo.title !== "") {
                replacement = "[[" + tabInfo.title + "|" + tabInfo.url + "]]";
            } else {
                replacement = "[[Source|" + tabInfo.url + "]]";
            }
        } else {
            if (tabInfo.title && tabInfo.title !== "") {
                replacement = tabInfo.title;
            } else {
                replacement = "Unknown Source";
            }
        }
        return replacement;
    },
    URL: (tabInfo: ITabInfo) => {
        let replacement = "";
        if (tabInfo.url && tabInfo.url !== "") {
            replacement = tabInfo.url;
        } else {
            replacement = "Unknown URL";
        }
        return replacement;
    },
    TITLE: (tabInfo: ITabInfo) => {
        let replacement = "";
        if (tabInfo.title && tabInfo.title !== "") {
            replacement = tabInfo.title;
        } else {
            replacement = "Unknown Page Title";
        }
        return replacement;
    },
};
export default TAB_CODES;
