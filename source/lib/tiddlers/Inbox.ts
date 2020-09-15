import AbstractTiddler from "./AbstractTiddler";
import formatit from "../formatting/formatit";
class Inbox extends AbstractTiddler {
    async _populateTitle() {
        const title = await this._configStorage.get("inbox_tiddler_title");
        this._tiddlerTitle = formatit(title);
    }

    async addText(text: string) {
        const text_prefix = await this._configStorage.get("inbox_text_prefix");
        const text_suffix = await this._configStorage.get("inbox_text_suffix");

        let newText =
            formatit(text_prefix) + formatit(text) + formatit(text_suffix);

        let tiddlerText = this.getTiddlerText();
        tiddlerText = tiddlerText + newText;
        this.setTiddlerText(tiddlerText);
    }
}
export default Inbox;
