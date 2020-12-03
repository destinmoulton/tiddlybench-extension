//import editortabs from "../lib/editortabs";
//import editorcache from "../lib/storage/tiddlerdrafts";
import API from "../lib/API";
import ConfigStorage from "../lib/storage/ConfigStorage";
import ContextMenuStorage from "../lib/storage/ContextMenuStorage";
import ListTiddlers from "./sections/ListTiddlers";
import TiddlerForm from "./sections/TiddlerForm";
import Messenger from "../lib/Messenger";
import TabsManager from "../lib/TabsManager";

//import TabsManager from "../lib/TabsManager";
window.addEventListener("load", () => {
    const configStorage = new ConfigStorage();
    const contextMenuStorage = new ContextMenuStorage(configStorage);
    const tabsManager = new TabsManager();
    const api = new API(configStorage);
    const messenger = new Messenger();
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
    const tabs = new Tabs(listTiddlers, tiddlerForm);
    tabs.initialize();
});

class Tabs {
    private listTiddlers: ListTiddlers;
    private tiddlerForm: TiddlerForm;
    private activeSection: string;

    constructor(listTiddlers: ListTiddlers, tiddlerForm: TiddlerForm) {
        this.listTiddlers = listTiddlers;
        this.tiddlerForm = tiddlerForm;
        this.activeSection = "";
    }

    public initialize() {
        this.activeSection = this.getActiveSection();
        this.listTiddlers.initialize("tb-tabs-root");
        this.tiddlerForm.initialize("tb-tabs-root");
        this.display();

        // Re-run the display method when
        // the hash changes
        window.addEventListener("hashchange", this.handleHashChange.bind(this));
    }

    private handleHashChange() {
        this.activeSection = this.getActiveSection();
        this.display();
    }

    private display() {
        switch (this.activeSection) {
            case "choose_tiddler": {
                this.listTiddlers.display();
                break;
            }
            case "tiddler_form": {
                this.tiddlerForm.display();
                break;
            }
            default:
                this.listTiddlers.display();
                break;
        }
    }

    private getActiveSection(): string {
        const params = this.getHashParams();
        const section = params.get("section");
        if (section) {
            return section;
        }
        return "";
    }

    private getHashParams() {
        return new URLSearchParams(window.location.hash.substr(1));
    }
}
