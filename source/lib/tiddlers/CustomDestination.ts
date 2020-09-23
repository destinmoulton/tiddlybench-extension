import AbstractTiddler from "./AbstractTiddler";
import formatit from "../formatting/formatit";
import { ETiddlerSource } from "../../enums";
class CustomDestination extends AbstractTiddler {
    setupTiddler(source: ETiddlerSource, title: string) {
        this._tiddlerSource = source;
        this._tiddlerTitle = title;
        this._populateTiddler();
    }

    _populateTitle() {
        // do nothing; the title is set via
        // setupTiddler (a custom method)
    }

    async addText(text: string, tab: browser.tabs.Tab | undefined) {
        const text_prefix = await this._configStorage.get("inbox_text_prefix");
        const text_suffix = await this._configStorage.get("inbox_text_suffix");

        let newText =
            formatit(text_prefix, tab) +
            formatit(text, tab) +
            formatit(text_suffix, tab);

        let tiddlerText = this.getTiddlerText();
        tiddlerText = tiddlerText + newText;
        this.setTiddlerText(tiddlerText);
    }
}
export default CustomDestination;
