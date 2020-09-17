import dateformat from "./DateFormat";
import textformat from "./TextFormat";
import tabformat from "./TabFormat";

/**
 * Format strings are in the format {[<type>|<format>]}
 *
 * @param text string
 */
export default function formatit(
    text: string,
    tab: browser.tabs.Tab | undefined
): string {
    // Run the formatters
    text = dateformat(text);
    text = textformat(text);
    text = tabformat(text, tab);

    return text;
}
