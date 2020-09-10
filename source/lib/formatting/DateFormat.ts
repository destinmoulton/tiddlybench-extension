import moment from "moment";

import { IFormatMap } from "../../types";
/**
 * Map of tiddlywiki date format to momentjs
 * date format.
 *
 * https://tiddlywiki.com/static/DateFormat.html
 * https://momentjs.com/docs/#/displaying/
 */
const DATE_FORMAT_MAP: IFormatMap = {
    DDD: "dddd",
    ddd: "ddd",
    DD: "D",
    "0DD": "DD",
    WW: "W",
    "0WW": "WW",
    MMM: "MMMM",
    mmm: "MMM",
    MM: "M",
    "0MM": "MM",
    YYYY: "YYYY",
    YY: "YY",
    wYYYY: "",
    wYY: "",
    hh: "H",
    "0hh": "HH",
    hh12: "h",
    "0hh12": "hh",
    mm: "m",
    "0mm": "mm",
    ss: "s",
    "0ss": "ss",
    XXX: "",
    "0XXX": "",
    am: "a",
    pm: "a",
    AM: "A",
    PM: "A",
    TZD: "",
    "[UTC]": "",
};

/**
 * Convert the TiddlyWiki formatted string to
 * a moment compatible version using the map.
 *
 * @param original string
 */
function convertTWtoMoment(original: string) {
    const tdKeys = Object.keys(DATE_FORMAT_MAP);

    let rep = original;
    for (let part of tdKeys) {
        const momentReplacement = DATE_FORMAT_MAP[part];
        rep = rep.replaceAll(part, momentReplacement);
    }
    return rep;
}

/**
 * Apply the time to any possible DateFormat parts
 * of a tiddler title.
 *
 * @param tiddlerTitle string
 */
export default function dateformat(tiddlerTitle: string) {
    const momentCompatible = convertTWtoMoment(tiddlerTitle);

    const time = moment();
    return time.format(momentCompatible);
}
