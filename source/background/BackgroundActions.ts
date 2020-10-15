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
import Messenger from "../lib/Messenger";
import TabsManager from "../lib/TabsManager";
import TiddlerDispatcher from "../lib/tiddlers/TiddlerDispatcher";
import { IDispatchOptions } from "../types";
import {
    EDestinationTiddler,
    EDispatchAction,
    EDispatchSource,
} from "../enums";

class BackgroundActions {
    _api: API;
    _configStorage: ConfigStorage;
    _contextMenuStorage: ContextMenuStorage;
    _messenger: Messenger;
    _tabsManager: TabsManager;
    _tiddlerDispatcher: TiddlerDispatcher;

    constructor(
        api: API,
        configStorage: ConfigStorage,
        contextMenuStorage: ContextMenuStorage,
        messenger: Messenger,
        tabsManager: TabsManager,
        tiddlerDispatcher: TiddlerDispatcher
    ) {
        this._api = api;
        this._configStorage = configStorage;
        this._contextMenuStorage = contextMenuStorage;
        this._messenger = messenger;
        this._tabsManager = tabsManager;
        this._tiddlerDispatcher = tiddlerDispatcher;
    }

    /**
     * Method to be called by the Messenger setupListener method.
     * @param data
     * @param sender
     */
    async handleMessengerMessages(
        msg: IDispatchOptions
        //sender: browser.runtime.MessageSender
    ) {
        return await this._tiddlerDispatcher.dispatchMessengerAction(msg);
        /**
        if (data.dispatch === "tiddler") {
            switch (data.type) {
                case "journal": {
                    const res = await this._addText(
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
                    const cache = await this._contextMenuStorage.getCacheByID(
                        cacheID
                    );
                    if (
                        cache &&
                        cache.clickData.selectionText &&
                        cache.tabData &&
                        cache.tabData.title
                    ) {
                        const blockType = await this._contextMenuStorage.getSelectedBlockType();

                        const tabInfo: ITabInfo = {
                            title: cache.tabData.title,
                            url: cache.tabData.url,
                        };
                        const res = await this.addTextToCustomDestination(
                            data.packet.tiddler_id,
                            cache.clickData.selectionText,
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
        **/
    }

    async handleContextMenuClicks(
        clickData: browser.contextMenus.OnClickData,
        tabData: browser.tabs.Tab | undefined
    ) {
        const [command, params] = this._parseContextID(
            <string>clickData.menuItemId
        );
        if (!params["action"]) {
            throw new Error(
                "action is not defined for this context menu option"
            );
        }
        switch (command) {
            case "tb-ctxt-action": {
                switch (params["action"]) {
                    case EDispatchAction.CHANGE_BLOCKTYPE: {
                        if (!params["blocktype"]) {
                            throw new Error(
                                "blocktype must be set if change-blocktype action is requested"
                            );
                        }
                        await this._contextMenuStorage.setSelectedBlockType(
                            params["blocktype"]
                        );
                        break;
                    }
                    case EDispatchAction.CHOOSE_CUSTOM_DESTINATION: {
                        const cacheID = await this._contextMenuStorage.addCache(
                            params["context"],
                            clickData,
                            tabData
                        );
                        await this._tabsManager.openChooseTiddlerTab(cacheID);
                        break;
                    }
                    case EDispatchAction.ADD_TEXT: {
                        const options: IDispatchOptions = {
                            action: params["action"],
                            context: params["context"],
                            source: EDispatchSource.CONTEXTMENU,
                            destination: params["destination"]
                                ? params["destination"]
                                : EDestinationTiddler.NONE,
                            packet: {
                                cache_id: params["cache_id"]
                                    ? params["cache_id"]
                                    : null,
                                tiddler_id: params["tiddler_id"]
                                    ? params["tiddler_id"]
                                    : null,
                            },
                        };
                        this._tiddlerDispatcher.dispatchContextAction(
                            options,
                            clickData,
                            tabData
                        );
                    }
                }
                break;
            }
        }
    }
    /**
     * The context menu `id` property
     * is used to pass information to the context menu
     * handler.
     *
     * This is encoded as: <command>|<param1>=<value1>&...<paramN>=<valueN>
     */
    _parseContextID(id: string): [string, any] {
        // The context menu id might be separated by |
        const [command, suffix] = id.split("|");

        const params: any = {};
        if (suffix) {
            //Parameter/value combos are separated by `&`
            const parts = suffix.split("&");
            for (let part of parts) {
                // Try breaking up the parameters
                const [leftSide, rightSide] = part.split("=");
                if (leftSide && rightSide) {
                    params[leftSide] = rightSide;
                } else {
                    throw new Error(
                        "BackgroundActions :: One of the suffix parameters is missing. " +
                            leftSide
                    );
                }
            }
        }

        if (!params["action"]) {
            throw new Error(
                "action is a required parameter in the context menu option id field."
            );
        }
        if (!params["context"]) {
            throw new Error(
                "context is a required parameter in the context menu option id field."
            );
        }

        return [command, params];
    }
}
export default BackgroundActions;
