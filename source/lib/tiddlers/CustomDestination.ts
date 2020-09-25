import AbstractTiddler from "./AbstractTiddler";
import { ETiddlerSource } from "../../enums";
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
}
export default CustomDestination;
