/**
 * Recoder.ts
 *
 * @class Recoder
 *
 * Recode text.
 */

import dayjs from "dayjs";
import _ from "lodash";

import DATE_CODES from "./date_codes";
import TAB_CODES from "./tab_codes";
import TEXT_CODES from "./text_codes";

import { IRecodeData } from "../../types";

const CODE_SETS = [
    { type: "date", codes: DATE_CODES },
    { type: "function", codes: TAB_CODES },
    { type: "string", codes: TEXT_CODES },
];

export default function recoder(data: IRecodeData): string {
    const now = dayjs();
    let text = data.text;
    for (let set of CODE_SETS) {
        const codes = set.codes;
        for (let code in codes) {
            const recode = codes[code];
            const regx = new RegExp(_.escapeRegExp("{[" + code + "]}"), "g");
            const idx = text.search(regx);
            let replacement = "";
            if (idx > -1) {
                switch (set.type) {
                    case "date": {
                        if (_.isString(recode) && recode !== "") {
                            replacement = now.format(recode);
                        }
                        break;
                    }
                    case "function": {
                        if (_.isFunction(recode)) {
                            replacement = recode(data);
                        }
                        break;
                    }
                    case "string": {
                        if (_.isString(recode) && recode !== "") {
                            replacement = recode;
                        }
                        break;
                    }
                }
            }
            text = text.replaceAll(regx, replacement);
        }
    }
    return text;
}
