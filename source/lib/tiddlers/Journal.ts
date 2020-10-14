import AbstractTiddler from "./AbstractTiddler";
import recoder from "../formatting/recoder";
import { EConfigKey } from "../../enums";
import { IDispatchOptions } from "../../types";
class Journal extends AbstractTiddler {
    async populateTitle(options: IDispatchOptions) {
        if (!options) {
            throw new Error("options is a required parameter");
        }
        const title = await this._configStorage.get(
            EConfigKey.TIDDLER_JOURNAL_TITLE
        );
        this._tiddlerTitle = recoder({ text: title });
    }
}
export default Journal;
