import AbstractTiddler from "./AbstractTiddler";
import { EConfigKey } from "../../enums";
class Journal extends AbstractTiddler {
    async configure() {
        const title = await this.configStorage.get(
            EConfigKey.TIDDLER_JOURNAL_TITLE
        );
        this.setTiddlerTitle(title);
        return await this.populateTiddler();
    }
}
export default Journal;
