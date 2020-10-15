/**
 * TiddlerForm.ts
 *
 *
 */
import AbstractTabSection from "./AbstractTabSection";
import API from "../../lib/API";
//import dom from "../../lib/dom";
import ContextMenuStorage from "../../lib/storage/ContextMenuStorage";
import Messenger from "../../lib/Messenger";
import TabsManager from "../../lib/TabsManager";

export default class TiddlerForm extends AbstractTabSection {
    _contextMenuStorage: ContextMenuStorage;
    _messenger: Messenger;
    _tabsManager: TabsManager;

    constructor(
        api: API,
        contextMenuStorage: ContextMenuStorage,
        messenger: Messenger,
        tabsManager: TabsManager
    ) {
        super(api);
        this._contextMenuStorage = contextMenuStorage;
        this._messenger = messenger;
        this._tabsManager = tabsManager;
    }

    async display() {
        console.log("running display for TiddlerForm");

        const compiled = this._compile("tmpl-tiddler-form", {});

        this._render(compiled);
    }
}
