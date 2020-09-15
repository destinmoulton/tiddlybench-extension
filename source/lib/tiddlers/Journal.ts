import AbstractTiddler from "./AbstractTiddler";
import config from "../storage/ConfigStorage";
import formatit from "../formatting/formatit";
class Journal extends AbstractTiddler {
    async _populateTitle() {
        const title = await config.get("journal_tiddler_title");
        this._tiddlerTitle = formatit(title);
        console.log("Journal :: " + this._tiddlerTitle);
    }

    async addText(text: string) {
        const text_prefix = await this._configStorage.get(
            "journal_text_prefix"
        );
        const text_suffix = await this._configStorage.get(
            "journal_text_suffix"
        );

        let newText =
            formatit(text_prefix) + formatit(text) + formatit(text_suffix);

        let tiddlerText = this.getTiddlerText();
        tiddlerText = tiddlerText + newText;
        this.setTiddlerText(tiddlerText);
    }
}
export default Journal;
