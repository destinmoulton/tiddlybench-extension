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
import { ETiddlerSource } from "../enums";
import { ITabInfo } from "../types";

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
                    await this._contextMenuStorage.addSelectionCache(
                        info.pageUrl,
                        tab.title,
                        info.selectionText
                    );
                    await this._tabsManager.openChooseTiddlerTab();
                }
                break;
            case "tb-ctxt-add-to-inbox":
                try {
                    if (
                        tab &&
                        info.selectionText &&
                        info.selectionText !== ""
                    ) {
                        const tabInfo: ITabInfo = {
                            title: tab.title,
                            url: tab.url,
                        };
                        await this.addTextToInbox(
                            ETiddlerSource.FromContextMenu,
                            info.selectionText,
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
                        const tabInfo: ITabInfo = {
                            title: tab.title,
                            url: tab.url,
                        };
                        await this.addTextToJournal(
                            ETiddlerSource.FromContextMenu,
                            info.selectionText,
                            tabInfo
                        );
                    }
                } catch (err) {
                    throw err;
                }
                break;
            case "tb-ctxt-add-to-destination": {
                if (tab && info.selectionText && info.selectionText !== "") {
                    const tabInfo: ITabInfo = {
                        title: tab.title,
                        url: tab.url,
                    };
                    this.addTextToCustomDestination(
                        ETiddlerSource.FromContextMenu,
                        info.selectionText,
                        menuSuffix,
                        tabInfo
                    );
                }
                break;
            }
        }
    }

    async addTextToJournal(
        source: ETiddlerSource,
        text: string,
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
        await journal.initialize(source);
        await journal.addText(text, tabInfo);
        return await journal.submit();
    }

    async addTextToInbox(
        source: ETiddlerSource,
        text: string,
        tab: ITabInfo | undefined
    ) {
        const inbox = new Inbox(
            this._api,
            this._configStorage,
            this._contextMenuStorage
        );
        await inbox.initialize(source);
        await inbox.addText(text, tab);
        return await inbox.submit();
    }

    async addTextToCustomDestination(
        source: ETiddlerSource,
        text: string,
        id: string,
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
            console.log(
                "BackgroundActions :: destination details",
                destination
            );
            await custom.setupCustomTiddler(source, destination.tiddler.title);
            await custom.addText(text, tab);
            return await custom.submit();
        }
        return;
    }
}
export default BackgroundActions;
