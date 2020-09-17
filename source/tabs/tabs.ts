//import editortabs from "../lib/editortabs";
//import editorcache from "../lib/storage/tiddlerdrafts";

window.addEventListener("load", () => {
    const editor = new Tabs();
    editor.initialize();
});
const TEMP;
class Tabs {
    _activeSection: string;

    constructor() {
        this._activeSection = "";
    }

    initialize() {
        this._activeSection = this._getActiveSection();
        this._display();
    }

    _display() {
        switch (this._activeSection) {
            case "choose_tiddler": {
                break;
            }
        }
    }

    _getActiveSection(): string {
        const params = this._getHashParams();
        const section = params.get("section");
        if (section) {
            return section;
        }
        return "";
    }

    _getHashParams() {
        return new URLSearchParams(window.location.hash.substr(1));
    }
}
