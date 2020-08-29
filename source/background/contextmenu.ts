import { browser } from "webextension-polyfill-ts";
import config from "../lib/config";
import logger from "../lib/logger";
class ContextMenu {
    isContextMenuEnabled: string = "off";

    async initialize() {
        await this.reconfigure();
    }
    // Called by config when the config values are changed
    async reconfigure() {
        const [shouldBeEnabled, err] = await config.get(
            "context_menu_visibility"
        );

        if (err) {
            logger.error("ContextMenu :: reconfigure()", err);
        }

        if (err === null) {
            if (shouldBeEnabled !== this.isContextMenuEnabled) {
                this.isContextMenuEnabled = shouldBeEnabled;
            }
            if (this.isContextMenuEnabled === "on") {
                this.enableContextMenu();
            } else {
                this.disableContextMenu();
            }
        }
    }

    enableContextMenu() {
        browser.contextMenus.create({
            id: "tb-ctxt-add-to-tiddler",
            title: "Add '%s' to a tiddler.",
            contexts: ["selection"],
        });
    }

    disableContextMenu() {
        browser.contextMenus.removeAll();
    }
}

export default new ContextMenu();
