import AbstractTiddler from "./AbstractTiddler";
import formatit from "../formatting/formatit";
import { ETiddlerSource } from "../../enums";
import { ITabInfo } from "../../types";
class CustomDestination extends AbstractTiddler {
    async setupCustomTiddler(source: ETiddlerSource, title: string) {
        this._tiddlerSource = source;
        this._tiddlerTitle = title;
        await this._populateTiddler();
    }

    _populateTitle() {
        // do nothing; the title is set via
        // setupTiddler (a custom method)
    }

    async addText(text: string, tabInfo: ITabInfo | undefined) {
        const text_prefix = await this._configStorage.get(
            "selection_customdestination_text_prefix"
        );
        const text_suffix = await this._configStorage.get(
            "selection_customdestination_text_suffix"
        );

        let newText =
            formatit(text_prefix, tabInfo) +
            formatit(text, tabInfo) +
            formatit(text_suffix, tabInfo);

        let tiddlerText = this.getTiddlerText();
        tiddlerText = tiddlerText + newText;
        this.setTiddlerText(tiddlerText);
    }
}
export default CustomDestination;
