import AbstractTiddler from "./AbstractTiddler";
class CustomDestination extends AbstractTiddler {
    async setupCustomTiddler(title: string) {
        this._tiddlerTitle = title;
        await this._populateTiddler();
    }

    _populateTitle() {
        // do nothing; the title is set via
        // setupTiddler (a custom method)
    }
}
export default CustomDestination;
