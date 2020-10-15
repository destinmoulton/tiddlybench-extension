import AbstractTiddler from "./AbstractTiddler";
import recoder from "../formatting/recoder";
import { EConfigKey } from "../../enums";
import { IDispatchOptions } from "../../types";
class Inbox extends AbstractTiddler {
    async configure(options: IDispatchOptions) {
        if (!options) {
            throw new Error("options is a required parameter");
        }
        const title = await this._configStorage.get(
            EConfigKey.TIDDLER_INBOX_TITLE
        );
        this._tiddlerTitle = recoder({ text: title });
        return await this.populateTiddler();
    }
}
export default Inbox;
