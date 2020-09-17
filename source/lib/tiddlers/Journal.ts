import AbstractTiddler from "./AbstractTiddler";
import formatit from "../formatting/formatit";
class Journal extends AbstractTiddler {
    async _populateTitle() {
        const title = await this._configStorage.get("journal_tiddler_title");
        this._tiddlerTitle = formatit(title, undefined);
        console.log("Journal :: " + this._tiddlerTitle);
    }

    async addText(text: string, tab: browser.tabs.Tab | undefined) {
        const text_prefix = await this._configStorage.get(
            "journal_text_prefix"
        );
        const text_suffix = await this._configStorage.get(
            "journal_text_suffix"
        );

        let newText =
            formatit(text_prefix, tab) +
            formatit(text, tab) +
            formatit(text_suffix, tab);

        let tiddlerText = this.getTiddlerText();
        tiddlerText = tiddlerText + newText;
        this.setTiddlerText(tiddlerText);
    }
}
export default Journal;
