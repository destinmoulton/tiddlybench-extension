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
import ContextMenuStorage from "../lib/storage/ContextMenuStorage";
import CustomDestination from "../lib/tiddlers/CustomDestination";
import Journal from "../lib/tiddlers/Journal";
import Inbox from "../lib/tiddlers/Inbox";
import Messenger from "../lib/Messenger";
import TabsManager from "../lib/TabsManager";
import { ITabInfo } from "../types";
import notify from "../lib/notify";

class BackgroundActions {
    _api: API;
    _configStorage: ConfigStorage;
    _contextMenuStorage: ContextMenuStorage;
    _messenger: Messenger;
    _tabsManager: TabsManager;

    constructor(
        api: API,
        configStorage: ConfigStorage,
        contextMenuStorage: ContextMenuStorage,
        messenger: Messenger,
        tabsManager: TabsManager
    ) {
        this._api = api;
        this._configStorage = configStorage;
        this._contextMenuStorage = contextMenuStorage;
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
                        data.packet.text,
                        data.packet.blockType,
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
                    break;
                }
                case "inbox": {
                    const res = await this.addTextToInbox(
                        data.packet.text,
                        data.packet.blockType,
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
                    break;
                }
                case "customdestination-from-choose-tiddler-tab": {
                    const cacheID = data.packet.cache_id;
                    const cache = await this._contextMenuStorage.getSelectionCacheByID(
                        cacheID
                    );
                    if (cache && cache.selected_text) {
                        const blockType = await this._contextMenuStorage.getSelectedBlockType();
                        const tabInfo: ITabInfo = {
                            title: cache.page_title,
                            url: cache.page_url,
                        };
                        const res = await this.addTextToCustomDestination(
                            data.packet.tiddler_id,
                            cache.selected_text,
                            blockType,
                            tabInfo
                        );
                        const title = data.packet.tiddler_title.substring(
                            0,
                            25
                        );
                        if (res.ok) {
                            return Promise.resolve({
                                ok: true,
                                message: `Selected text added to ${title}`,
                            });
                        } else {
                            return Promise.reject({
                                ok: false,
                                message: `Failed to add selected text to ${title}`,
                            });
                        }
                    }
                    break;
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
        // The context menu id might be separated by |
        const [menuPrefix, menuSuffix] = (<string>info.menuItemId).split("|");

        switch (menuPrefix) {
            case "tb-ctxt-configure": {
                await this._tabsManager.openSettingsTab();
                break;
            }
            case "tb-ctxt-change-blocktype": {
                await this._contextMenuStorage.setSelectedBlockType(menuSuffix);
                break;
            }
            case "tb-ctxt-choose-tiddler":
                if (tab && info.pageUrl && tab.title && info.selectionText) {
                    const cacheID = await this._contextMenuStorage.addSelectionCache(
                        info.pageUrl,
                        tab.title,
                        info.selectionText
                    );
                    await this._tabsManager.openChooseTiddlerTab(cacheID);
                }
                break;
            case "tb-ctxt-add-to-inbox":
                try {
                    if (
                        tab &&
                        info.selectionText &&
                        info.selectionText !== ""
                    ) {
                        const blockType = await this._contextMenuStorage.getSelectedBlockType();
                        const tabInfo: ITabInfo = {
                            title: tab.title,
                            url: tab.url,
                        };
                        await this.addTextToInbox(
                            info.selectionText,
                            blockType,
                            tabInfo
                        );
                    }
                } catch (err) {
                    throw err;
                }
                break;
            case "tb-ctxt-add-to-journal":
                try {
                    if (
                        tab &&
                        info.selectionText &&
                        info.selectionText !== ""
                    ) {
                        const blockType = await this._contextMenuStorage.getSelectedBlockType();
                        const tabInfo: ITabInfo = {
                            title: tab.title,
                            url: tab.url,
                        };
                        await this.addTextToJournal(
                            info.selectionText,
                            blockType,
                            tabInfo
                        );
                    }
                } catch (err) {
                    throw err;
                }
                break;
            case "tb-ctxt-add-to-destination": {
                if (tab && info.selectionText && info.selectionText !== "") {
                    const blockType = await this._contextMenuStorage.getSelectedBlockType();
                    const tabInfo: ITabInfo = {
                        title: tab.title,
                        url: tab.url,
                    };
                    await this.addTextToCustomDestination(
                        menuSuffix, // in this case the menuSuffix is the id of the tiddler
                        info.selectionText,
                        blockType,
                        tabInfo
                    );
                }
                break;
            }
        }
    }

    async addTextToJournal(
        text: string,
        blockType: string,
        tab: ITabInfo | undefined
    ) {
        let tabInfo = undefined;

        if (tab) {
            tabInfo = {
                title: tab.title,
                url: tab.url,
            };
        }
        const journal = new Journal(
            this._api,
            this._configStorage,
            this._contextMenuStorage
        );
        await journal.initialize();
        await journal.addText(text, blockType, tabInfo);
        const response = await journal.submit();
        const tiddlerTitle = journal.getTiddlerTitle();
        if (response.ok) {
            await notify(`Text has been added to ${tiddlerTitle}`);
        }
        return response;
    }

    async addTextToInbox(
        text: string,
        blockType: string,
        tab: ITabInfo | undefined
    ) {
        const inbox = new Inbox(
            this._api,
            this._configStorage,
            this._contextMenuStorage
        );
        await inbox.initialize();
        await inbox.addText(text, blockType, tab);
        const response = await inbox.submit();
        const tiddlerTitle = inbox.getTiddlerTitle();
        if (response.ok) {
            await notify(`Text has been added to ${tiddlerTitle}`);
        }
        return response;
    }

    async addTextToCustomDestination(
        id: string,
        text: string,
        blockType: string,
        tab: ITabInfo | undefined
    ) {
        const destination = await this._contextMenuStorage.findDestinationById(
            id
        );
        if (destination && destination.tiddler) {
            const custom = new CustomDestination(
                this._api,
                this._configStorage,
                this._contextMenuStorage
            );
            await custom.setupCustomTiddler(destination.tiddler.title);
            await custom.addText(text, blockType, tab);
            const response = await custom.submit();
            const tiddlerTitle = custom.getTiddlerTitle();
            if (response.ok) {
                await notify(`Text has been added to ${tiddlerTitle}`);
            }
            return response;
        }
        return { ok: false };
    }
}
export default BackgroundActions;
