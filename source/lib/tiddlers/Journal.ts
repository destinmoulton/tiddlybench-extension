import AbstractTiddler from "./AbstractTiddler";
import formatit from "../formatting/formatit";
import { EConfigKey } from "../../enums";
class Journal extends AbstractTiddler {
    async _populateTitle() {
        const title = await this._configStorage.get(
            EConfigKey.TIDDLER_JOURNAL_TITLE
        );
        this._tiddlerTitle = formatit(title, undefined);
        console.log("Journal :: " + this._tiddlerTitle);
    }
}
export default Journal;
