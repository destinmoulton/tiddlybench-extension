import AbstractTiddler from "./AbstractTiddler";
import recoder from "../formatting/recoder";
import { EConfigKey } from "../../enums";
class Journal extends AbstractTiddler {
    async populateTitle() {
        const title = await this._configStorage.get(
            EConfigKey.TIDDLER_JOURNAL_TITLE
        );
        this._tiddlerTitle = recoder({ text: title });
    }
}
export default Journal;
