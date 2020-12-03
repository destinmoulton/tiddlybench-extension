import AbstractTiddler from "./AbstractTiddler";
import { EConfigKey } from "../../enums";
class Inbox extends AbstractTiddler {
    async configure() {
        const title = await this.configStorage.get(
            EConfigKey.TIDDLER_INBOX_TITLE
        );
        this.setTiddlerTitle(title);
        return await this.populateTiddler();
    }
}
export default Inbox;
