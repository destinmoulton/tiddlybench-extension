import { browser } from "webextension-polyfill-ts";
import config from "../lib/storage/config";
//import messenger from "../lib/messenger";
//import logger from "../lib/logger";
class ContextMenu {
    isContextMenuEnabled: string = "off";

    async initialize() {
        await this.reconfigure();
    }
    // Called by config when the config values are changed
    async reconfigure() {
        const shouldBeEnabled = await config.get("context_menu_visibility");
        if (shouldBeEnabled !== this.isContextMenuEnabled) {
            this.isContextMenuEnabled = shouldBeEnabled;
        }
        if (this.isContextMenuEnabled === "on") {
            this.enableContextMenu();
        } else {
            this.disableContextMenu();
        }
    }

    _onContextMenuCreated() {
        // Setup the context menu event listeners
        browser.contextMenus.onClicked.addListener((info, tab) => {
            switch (info.menuItemId) {
                case "tb-ctxt-add-to-tiddler":
                    console.log(tab);
                    browser.tabs.create({
                        url: "tabs/tiddler-editor.html",
                    });
                    break;
            }
        });
    }

    enableContextMenu() {
        browser.contextMenus.create(
            {
                id: "tb-ctxt-add-to-tiddler",
                title: "Add selection to Tiddler.",
                contexts: ["selection"],
            },
            this._onContextMenuCreated.bind(this)
        );
    }

    disableContextMenu() {
        browser.contextMenus.removeAll();
    }
}

export default new ContextMenu();
