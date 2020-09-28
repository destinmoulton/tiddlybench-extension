/**
 *
 * date_codes.ts
 *
 * Map of tiddlywiki date format to dayjs
 * date format.
 *
 * https://tiddlywiki.com/static/DateFormat.html
 */
import { ICodeMap } from "../../types";
const DATE_CODES: ICodeMap = {
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
export default DATE_CODES;
