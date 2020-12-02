//import editortabs from "../lib/editortabs";
//import editorcache from "../lib/storage/tiddlerdrafts";
import API from "../lib/API";
import ConfigStorage from "../lib/storage/ConfigStorage";
import ContextMenuStorage from "../lib/storage/ContextMenuStorage";
import ListTiddlers from "./sections/ListTiddlers";
import TiddlerForm from "./sections/TiddlerForm";
import Messenger from "../lib/Messenger";
import TabsManager from "../lib/TabsManager";
import InitialOptions from "./sections/InitialOptions";
//import TabsManager from "../lib/TabsManager";
window.addEventListener("load", () => {
    const configStorage = new ConfigStorage();
    const contextMenuStorage = new ContextMenuStorage(configStorage);
    const tabsManager = new TabsManager();
    const api = new API(configStorage);
    const messenger = new Messenger(api, configStorage);
    const initialOptions = new InitialOptions(api, tabsManager);
    const listTiddlers = new ListTiddlers(
        api,
        contextMenuStorage,
        messenger,
        tabsManager
    );
    const tiddlerForm = new TiddlerForm(
        api,
        contextMenuStorage,
        messenger,
        tabsManager
    );
    const tabs = new Tabs(initialOptions, listTiddlers, tiddlerForm);
    tabs.initialize();
});

class Tabs {
    _initialOptions: InitialOptions;
    _listTiddlers: ListTiddlers;
    _tiddlerForm: TiddlerForm;
    _activeSection: string;

    constructor(initialOptions: InitialOptions, listTiddlers: ListTiddlers, tiddlerForm: TiddlerForm) {
        this._initialOptions = initialOptions;
        this._listTiddlers = listTiddlers;
        this._tiddlerForm = tiddlerForm;
        this._activeSection = "";
    }

    initialize() {
        this._activeSection = this._getActiveSection();
        this._initialOptions.initialize("tb-tabs-root");
        this._listTiddlers.initialize("tb-tabs-root");
        this._tiddlerForm.initialize("tb-tabs-root");
        this._display();

        // Re-run the display method when
        // the hash changes
        window.addEventListener(
            "hashchange",
            this._handleHashChange.bind(this)
        );
    }

    _handleHashChange() {
        this._activeSection = this._getActiveSection();
        this._display();
    }

    _display() {
        switch (this._activeSection) {
            case "initial_options": {
                this._initialOptions.display();
                break;
            }
            case "choose_tiddler": {
                this._listTiddlers.display();
                break;
            }
            case "tiddler_form": {
                this._tiddlerForm.display();
                break;
            }
            default:
                this._initialOptions.display();
                break;
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
