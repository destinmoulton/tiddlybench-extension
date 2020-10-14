import AbstractTiddler from "./AbstractTiddler";
import recoder from "../formatting/recoder";
import { EConfigKey } from "../../enums";
class Inbox extends AbstractTiddler {
    async populateTitle() {
        const title = await this._configStorage.get(
            EConfigKey.TIDDLER_INBOX_TITLE
        );
        this._tiddlerTitle = recoder({ text: title });
    }
}
export default Inbox;
