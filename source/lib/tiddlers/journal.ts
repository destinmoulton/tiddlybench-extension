import AbstractTiddler from "./AbstractTiddler";
import config from "../storage/config";
import formatit from "../formatting/formatit";
class Journal extends AbstractTiddler {
    async _populateTitle() {
        const title = await config.get("journal_tiddler_title");
        this._tiddlerTitle = formatit(title);
        console.log("Journal :: " + this._tiddlerTitle);
    }

    async addText(text: string) {
        const text_prefix = await config.get("journal_text_prefix");
        const text_suffix = await config.get("journal_text_suffix");

        let newText =
            formatit(text_prefix) + formatit(text) + formatit(text_suffix);

        let tiddlerText = this.getTiddlerText();
        tiddlerText = tiddlerText + newText;
        this.setTiddlerText(tiddlerText);
    }
}
export default new Journal();
