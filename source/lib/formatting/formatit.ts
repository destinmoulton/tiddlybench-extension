import dateformat from "./DateFormat";
import textformat from "./TextFormat";

/**
 * Format strings are in the format {[<type>|<format>]}
 *
 * @param text string
 */
export default function formatit(text: string): string {
    // Run the formatters
    text = dateformat(text);
    text = textformat(text);

    return text;
}
