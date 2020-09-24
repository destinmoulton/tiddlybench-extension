import AbstractTiddler from "./AbstractTiddler";
import formatit from "../formatting/formatit";
import { ETiddlerSource } from "../../enums";
import { ITabInfo } from "../../types";
class Journal extends AbstractTiddler {
    async _populateTitle() {
        const title = await this._configStorage.get("journal_tiddler_title");
        this._tiddlerTitle = formatit(title, undefined);
        console.log("Journal :: " + this._tiddlerTitle);
    }

    async addText(text: string, tab: ITabInfo | undefined) {
        let text_prefix = "";
        let text_suffix = "";
        if (this._tiddlerSource === ETiddlerSource.FromContextMenu) {
            text_prefix = await this._configStorage.get(
                "selection_journal_text_prefix"
            );
            text_suffix = await this._configStorage.get(
                "selection_journal_text_suffix"
            );
        } else if (this._tiddlerSource === ETiddlerSource.FromQuickAdd) {
            text_prefix = await this._configStorage.get(
                "quickadd_journal_text_prefix"
            );
            text_suffix = await this._configStorage.get(
                "quickadd_journal_text_suffix"
            );
        } else {
            throw new Error("The source has not been defined.");
        }

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
