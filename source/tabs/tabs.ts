//import editortabs from "../lib/editortabs";
//import editorcache from "../lib/storage/tiddlerdrafts";
import API from "../lib/API";
import ConfigStorage from "../lib/storage/ConfigStorage";
import ListTiddlers from "./sections/ListTiddlers";
window.addEventListener("load", () => {
    const configStorage = new ConfigStorage();
    const api = new API(configStorage);
    const listTiddlers = new ListTiddlers(api);
    const tabs = new Tabs(listTiddlers);
    tabs.initialize();
});

class Tabs {
    _listTiddlers: ListTiddlers;
    _activeSection: string;

    constructor(listTiddlers: ListTiddlers) {
        this._listTiddlers = listTiddlers;
        this._activeSection = "";
    }

    initialize() {
        this._activeSection = this._getActiveSection();
        this._listTiddlers.initialize("tb-tabs-root");
        this._display();
    }

    _display() {
        switch (this._activeSection) {
            case "choose_tiddler": {
                this._listTiddlers.display();
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
