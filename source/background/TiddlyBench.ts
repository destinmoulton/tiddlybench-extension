import { browser } from "webextension-polyfill-ts";
import ConfigStorage from "../lib/storage/ConfigStorage";
import ContextMenu from "./ContextMenu";
//import config from "../lib/config";
import messenger from "../lib/messenger";
import logger from "../lib/logger";
class TiddlyBench {
    _contextMenu: ContextMenu;
    _configStorage: ConfigStorage;

    constructor() {
        this._configStorage = new ConfigStorage();
        this._contextMenu = new ContextMenu(this._configStorage);
    }

    async initialize() {
        logger.log("TiddlyBench :: intitialze() called");
        messenger.setupListener();

        await this._contextMenu.initialize();
        this.setupListeners();
    }

    setupListeners() {
        // Look for config changes (stored in .storage)
        browser.storage.onChanged.addListener(this.reconfigure);
    }

    async reconfigure() {
        console.log("browser.storage changed");
        logger.log("TiddlyBench :: reconfigure called");
        await this._contextMenu.reconfigure();
    }
}

export default TiddlyBench;
