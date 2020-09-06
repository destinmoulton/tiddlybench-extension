import { browser } from "webextension-polyfill-ts";
//import config from "../lib/config";
import messenger from "../lib/messenger";
import contextmenu from "./contextmenu";
import logger from "../lib/logger";
class TiddlyBench {
    async initialize() {
        logger.log("TiddlyBench :: intitialze() called");
        messenger.setupListener();

        await contextmenu.initialize();
        this.setupListeners();
    }

    setupListeners() {
        // Look for config changes (stored in .storage)
        browser.storage.onChanged.addListener(this.reconfigure);
    }

    async reconfigure() {
        console.log("browser.storage changed");
        logger.log("TiddlyBench :: reconfigure called");
        await contextmenu.reconfigure();
    }
}

export default new TiddlyBench();
