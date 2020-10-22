import AbstractTiddler from "./AbstractTiddler";
import { EConfigKey } from "../../enums";
class Bookmarks extends AbstractTiddler {
    async configure() {
        const title = await this._configStorage.get(
            EConfigKey.BOOKMARK_TIDDLER_TITLE
        );
        this.setTiddlerTitle(title);
        return await this.populateTiddler();
    }
}
export default Bookmarks;