/**
 * BackgroundActions.ts
 *
 * @class BackgroundActions
 *
 * Actions that the background script can perform.
 *
 * These actions could be called by the Messenger or
 * they could be called by the ContextMenu.
 */
//import { browser } from "webextension-polyfill-ts";

import API from "../lib/API";
import ConfigStorage from "../lib/storage/ConfigStorage";
import Journal from "../lib/tiddlers/Journal";
import Inbox from "../lib/tiddlers/Inbox";
import Messenger from "../lib/Messenger";
import TabsManager from "../lib/TabsManager";
import { ETiddlerSource } from "../enums";

class BackgroundActions {
    _api: API;
    _configStorage: ConfigStorage;
    _messenger: Messenger;
    _tabsManager: TabsManager;

    constructor(
        api: API,
        configStorage: ConfigStorage,
        messenger: Messenger,
        tabsManager: TabsManager
    ) {
        this._api = api;
        this._configStorage = configStorage;
        this._messenger = messenger;
        this._tabsManager = tabsManager;
    }

    /**
     * Method to be called by the Messenger setupListener method.
     * @param data
     * @param sender
     */
    async handleMessengerMessages(
        data: any,
        sender: browser.runtime.MessageSender
    ): Promise<any> {
        if (data.dispatch === "tiddler") {
            switch (data.type) {
                case "journal": {
                    const res = await this.addTextToJournal(
                        ETiddlerSource.FromQuickAdd,
                        data.packet.text,
                        undefined
                    );
                    if (res.ok) {
                        return Promise.resolve({
                            ok: true,
                            message: "Journal text added.",
                        });
                    } else {
                        return Promise.reject({
                            ok: false,
                            message: "Failed to add the Journal text.",
                        });
                    }
                }
                case "inbox": {
                    const res = await this.addTextToInbox(
                        ETiddlerSource.FromQuickAdd,
                        data.packet.text,
                        undefined
                    );
                    if (res.ok) {
                        return Promise.resolve({
                            ok: true,
                            message: "Inbox text added.",
                        });
                    } else {
                        return Promise.reject({
                            ok: false,
                            message: "Failed to add the Inbox text.",
                        });
                    }
                }
            }
        }
        return Promise.reject({
            ok: false,
            sender,
            message: "No dispatch or type parameters provided in the data.",
        });
    }

    async handleContextMenuClicks(
        info: browser.contextMenus.OnClickData,
        tab: browser.tabs.Tab | undefined
    ) {
        switch (info.menuItemId) {
            case "tb-ctxt-configure": {
                await this._tabsManager.openSettingsTab();
                break;
            }
            case "tb-ctxt-add-to-tiddler":
                if (tab && info.pageUrl && tab.title && info.selectionText) {
                    await this._tabsManager.openChooseTiddlerTab();
                    /**editortabs.create(
                        info.pageUrl,
                        tab.title,
                        info.selectionText
                    );**/
                }
                break;
            case "tb-ctxt-add-to-inbox":
                try {
                    if (info.selectionText && info.selectionText !== "") {
                        await this.addTextToInbox(
                            ETiddlerSource.FromContextMenu,
                            info.selectionText,
                            tab
                        );
                    }
                } catch (err) {
                    throw err;
                }
                break;
        }
    }

    async addTextToJournal(
        source: ETiddlerSource,
        text: string,
        tab: browser.tabs.Tab | undefined
    ) {
        const journal = new Journal(this._configStorage, this._api);
        await journal.initialize(source);
        await journal.addText(text, tab);
        return await journal.submit();
    }

    async addTextToInbox(
        source: ETiddlerSource,
        text: string,
        tab: browser.tabs.Tab | undefined
    ) {
        const inbox = new Inbox(this._configStorage, this._api);
        await inbox.initialize(source);
        await inbox.addText(text, tab);
        return await inbox.submit();
    }
}
export default BackgroundActions;
