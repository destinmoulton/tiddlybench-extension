import { browser } from "webextension-polyfill-ts";
//import config from "../lib/config";
import messenger from "../lib/messenger";

class TiddlyBench {
    async initialize() {
        this.reconfigure();
        messenger.setup();
    }

    setupListeners() {
        if (!browser.storage.onChanged.hasListener(this.reconfigure)) {
            // Detect when the configuration has been changed
            browser.storage.onChanged.addListener(this.reconfigure);
        }
    }

    async reconfigure() {
        //config.
    }
}

export default new TiddlyBench();
