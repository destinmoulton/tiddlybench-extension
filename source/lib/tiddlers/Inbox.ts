import AbstractTiddler from "./AbstractTiddler";
import formatit from "../formatting/formatit";
import { EConfigKey } from "../../enums";
class Inbox extends AbstractTiddler {
    async _populateTitle() {
        const title = await this._configStorage.get(
            EConfigKey.TIDDLER_INBOX_TITLE
        );
        this._tiddlerTitle = formatit(title, undefined);
    }
}
export default Inbox;
