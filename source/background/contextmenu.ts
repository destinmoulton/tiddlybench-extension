import { browser } from "webextension-polyfill-ts";
import _ from "lodash";
import config from "../lib/storage/config";
import editortabs from "../lib/editortabs";
//import api from "../lib/api";
//import messenger from "../lib/messenger";
//import logger from "../lib/logger";
class ContextMenu {
    isContextMenuEnabled: string = "off";
    doesContextMenuExist: boolean = false;

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
        if (
            !browser.contextMenus.onClicked.hasListener(
                this._onContextMenuClicked.bind(this)
            )
        ) {
        } else {
            console.log("context menu is already created");
        }
    }

    async _onContextMenuClicked(
        info: browser.contextMenus.OnClickData,
        tab: browser.tabs.Tab | undefined
    ) {
        switch (info.menuItemId) {
            case "tb-ctxt-add-to-tiddler":
                if (tab && info.pageUrl && tab.title && info.selectionText) {
                    editortabs.create(
                        info.pageUrl,
                        tab.title,
                        info.selectionText
                    );
                }
                break;
            case "tb-ctxt-add-to-inbox":
                try {
                    await browser.notifications.create({
                        type: "basic",
                        title: "TiddlyBench",
                        message: "Added selection to Inbox.",
                    });
                } catch (err) {
                    throw err;
                }
                break;
        }
    }

    enableContextMenu() {
        browser.contextMenus.create(
            {
                id: "tb-ctxt-add-to-tiddler",
                title: "Create new Tiddler from selection.",
                contexts: ["selection"],
            },
            this._onContextMenuCreated.bind(this)
        );
        browser.contextMenus.create(
            {
                id: "tb-ctxt-add-to-inbox",
                title: "Add selection to Inbox Tiddler.",
                contexts: ["selection"],
            },
            this._onContextMenuCreated.bind(this)
        );
        this.doesContextMenuExist = true;
        browser.contextMenus.onClicked.addListener(
            this._onContextMenuClicked.bind(this)
        );
    }

    disableContextMenu() {
        browser.contextMenus.removeAll();
    }
}

export default new ContextMenu();
