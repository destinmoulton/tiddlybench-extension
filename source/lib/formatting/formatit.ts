import dateformat from "./DateFormat";
import textformat from "./TextFormat";
import tabformat from "./TabFormat";

import { ITabInfo } from "../../types";

/**
 * Format strings are in the format {[<type>|<format>]}
 *
 * @param text string
 */
export default function formatit(
    text: string,
    tabInfo: ITabInfo | undefined
): string {
    // Run the formatters
    text = dateformat(text);
    text = textformat(text);
    if (tabInfo) {
        text = tabformat(text, tabInfo);
    }

    return text;
}
