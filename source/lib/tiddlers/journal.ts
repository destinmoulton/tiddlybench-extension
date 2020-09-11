import AbstractTiddler from "./AbstractTiddler";
import config from "../storage/config";
import formatit from "../formatting/formatit";
class Journal extends AbstractTiddler {
    async _populateTitle() {
        const title = await config.get("journal_tiddler_title");
        this._tiddlerTitle = formatit(title);
    }

    async addText(text: string) {
        const text_prefix = await config.get("journal_text_prefix");
        const text_suffix = await config.get("journal_text_suffix");

        let newText =
            formatit(text_prefix) + formatit(text) + formatit(text_suffix);

        console.log("Journal :: " + newText);
    }
}
export default new Journal();
