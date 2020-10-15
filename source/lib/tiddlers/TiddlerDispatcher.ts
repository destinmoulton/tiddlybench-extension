import API from "../API";
import ConfigStorage from "../storage/ConfigStorage";
import ContextMenuStorage from "../storage/ContextMenuStorage";
import CustomDestination from "./CustomDestination";
import Journal from "./Journal";
import Inbox from "./Inbox";
import {
    EContextType,
    EDestinationTiddler,
    EDispatchAction,
    EDispatchSource,
} from "../../enums";
import notify from "../../lib/notify";
import { IDispatchOptions, ITabInfo } from "../../types";

const DESTINATIONS = {
    [EDestinationTiddler.NONE]: null,
    [EDestinationTiddler.INBOX]: Inbox,
    [EDestinationTiddler.JOURNAL]: Journal,
    [EDestinationTiddler.CUSTOM]: CustomDestination,
};
class TiddlerDispatcher {
    _api: API;
    _configStorage: ConfigStorage;
    _contextMenuStorage: ContextMenuStorage;

    constructor(
        api: API,
        configStorage: ConfigStorage,
        contextMenuStorage: ContextMenuStorage
    ) {
        this._api = api;
        this._configStorage = configStorage;
        this._contextMenuStorage = contextMenuStorage;
    }

    async dispatchMessengerAction(msg: IDispatchOptions) {
        if (!msg.destination) {
            throw new Error(`The destination in msg is not defined`);
        }
        const tiddler = new DESTINATIONS[msg.destination](
            this._api,
            this._configStorage,
            this._contextMenuStorage
        );
        let res: any = null;
        let title: string = "";
        switch (msg.source) {
            case EDispatchSource.QUICKADD:
                console.log("quickadd message being processed");
                // Quick Add dispatcher
                if (!msg.packet.text) {
                    throw new Error(`The text in msg.packet.text is not set`);
                }
                if (!msg.packet.blockType) {
                    throw new Error(`The text in msg.packet.text is not set`);
                }
                await tiddler.configure(msg);
                tiddler.addText(
                    msg.packet.text,
                    msg.packet.blockType,
                    undefined
                );
                title = tiddler.getTiddlerTitle();

                break;
            case EDispatchSource.TAB:
                // Dispatched when a user selects a tiddler from the
                // TiddlerList component in a tab

                const blockType = await this._contextMenuStorage.getSelectedBlockType();

                const cacheID = msg.packet.cache_id;
                if (!cacheID) {
                    throw new Error(
                        "The context menu cache could not be found."
                    );
                }
                const cache = await this._contextMenuStorage.getCacheByID(
                    cacheID
                );
                if (
                    cache &&
                    cache.clickData.selectionText &&
                    cache.tabData &&
                    cache.tabData.title
                ) {
                    const tabInfo: ITabInfo = {
                        title: cache.tabData.title,
                        url: cache.tabData.url,
                    };
                    await tiddler.configure(msg);
                    await tiddler.addText(
                        cache.clickData.selectionText,
                        blockType,
                        tabInfo
                    );
                    let title = tiddler.getTiddlerTitle();
                    title = title.substring(0, 25);
                }
                break;
        }

        res = await tiddler.submit();
        if (res.ok) {
            return Promise.resolve({
                ok: true,
                message: `Added text to ${title}.`,
            });
        } else {
            return Promise.reject({
                ok: false,
                message: "Failed to add the text to ${title}.",
            });
        }
    }

    async dispatchContextAction(
        options: IDispatchOptions,
        clickData: browser.contextMenus.OnClickData | undefined,
        tabData: browser.tabs.Tab | undefined
    ) {
        console.log("dispatching context action", options, clickData, tabData);
        let tabInfo = undefined;
        if (tabData) {
            // Yes this is weird to transform the data
            // but we really only need two fields
            tabInfo = {
                title: tabData.title,
                url: tabData.url,
            };
        }

        if (!DESTINATIONS[options.destination]) {
            throw new Error(
                `${options.destination} is not an allowed destination.`
            );
        }
        if (options.action === EDispatchAction.ADD_TEXT) {
            if (options.destination !== EDestinationTiddler.NONE) {
                const tiddler = new DESTINATIONS[options.destination](
                    this._api,
                    this._configStorage,
                    this._contextMenuStorage
                );
                await tiddler.configure(options);

                if (options.context === EContextType.SELECTION && clickData) {
                    if (
                        clickData.selectionText &&
                        clickData.selectionText !== ""
                    ) {
                        const blockType = await this._contextMenuStorage.getSelectedBlockType();
                        await tiddler.addText(
                            clickData.selectionText,
                            blockType,
                            tabInfo
                        );

                        const response = await tiddler.submit();
                        if (response.ok) {
                            const tiddlerTitle = tiddler.getTiddlerTitle();
                            await notify(
                                `Text has been added to ${tiddlerTitle}`
                            );
                        }
                    }
                }
            }
        }
    }
}

export default TiddlerDispatcher;
