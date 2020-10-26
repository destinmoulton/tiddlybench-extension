import {truncate} from "lodash";

import API from "../API";
import ConfigStorage from "../storage/ConfigStorage";
import ContextMenuStorage from "../storage/ContextMenuStorage";
import Bookmarks from "./Bookmarks";
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
    [EDestinationTiddler.BOOKMARKS]: Bookmarks,
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
            case EDispatchSource.QUICKADD:{
                console.log("quickadd message being processed");
                // Quick Add dispatcher
                if (!msg.packet.text) {
                    throw new Error(`The text in msg.packet.text is not set`);
                }
                if (!msg.packet.blockType) {
                    throw new Error(`The text in msg.packet.text is not set`);
                }
                await tiddler.configure();
                await tiddler.addText(
                    msg.packet.text,
                    msg.packet.blockType,
                    undefined
                );
                title = tiddler.getTiddlerTitle();

                break;
            }
            case EDispatchSource.TAB:{
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

                if (!cache || !cache.clickData ||
                    !cache.clickData.selectionText || !cache.tabData || 
                    !cache.tabData.title || !cache.tabData.url){
                    throw new Error("tabData or clickData is not present in the message object");
                }

                const tabInfo: ITabInfo = {
                    title: cache.tabData.title,
                    url: cache.tabData.url,
                };

                switch(msg.action){
                    case EDispatchAction.ADD_TEXT_TO_TIDDLER:{
                        // A Tiddler has been selected from the TiddlerList
                        if(!msg.packet.tiddler_id){
                            throw new Error("TiddlerDispatcher :: the msg.packet.tiddler_id is not set.")
                        }
                        const dest = await this._contextMenuStorage.getCustomDestinationByID(
                            msg.packet.tiddler_id
                        );

                        if(!dest){
                            throw new Error("TiddlerDispatcher :: The destination was not found in the context menu storage.")
                        }
                        tiddler.setTiddlerTitle(dest.tiddler.title);
                        break;
                    }
                    case EDispatchAction.ADD_TIDDLER_WITH_TEXT:{
                        // The TiddlerForm Tab has been used to create a new tab
                        if(!msg.packet.tiddler_title || !msg.packet.tiddler_tags){
                            throw new Error("TiddlerDispatcher :: You must include the tiddler_title and tiddler_tags in the msg.packet.")
                        }
                        tiddler.setTiddlerTitle(msg.packet.tiddler_title)
                        tiddler.setTiddlerTags(msg.packet.tiddler_tags);

                        break;
                    }
                }
                    
                await tiddler.configure();
                await tiddler.addText(
                    cache.clickData.selectionText,
                    blockType,
                    tabInfo
                );
                let title = tiddler.getTiddlerTitle();
                title = truncate(title,{length:20});

                break;
            }
        }

        res = await tiddler.submit();
        if (res.ok) {
            return Promise.resolve({
                ok: true,
                message: `Added text to ${title} tiddler.`,
            });
        } else {
            return Promise.reject({
                ok: false,
                message: "Failed to add the text to ${title} tiddler.",
            });
        }
    }

    async dispatchContextAction(
        options: IDispatchOptions,
        clickData: browser.contextMenus.OnClickData | undefined,
        tabData: browser.tabs.Tab | undefined
    ) {
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

        if(options.destination === EDestinationTiddler.NONE ){
            throw new Error(
                "TiddlerDispatcher :: destination in options is null"
            );
        }

        const tiddler = new DESTINATIONS[options.destination](
            this._api,
            this._configStorage,
            this._contextMenuStorage
        );

        if(options.destination === EDestinationTiddler.CUSTOM){
            // Set the title for the custom destination tiddler
            if(!options.packet.tiddler_id){
                throw new Error("TiddlerDispatcher :: tiddler_id must be included in the options.packet")
            }
            const customDestination = await this._contextMenuStorage.getCustomDestinationByID(options.packet.tiddler_id);
            if(!customDestination){
                throw new Error("TiddlerDispatcher :: the customDestination could not be found in the context menu list of possible custom destinations.");
            }

            tiddler.setTiddlerTitle(customDestination.tiddler.title);
        }

        await tiddler.configure();

        switch(options.action){
            case EDispatchAction.ADD_TEXT_TO_TIDDLER: {
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
                break;
            }
            case EDispatchAction.ADD_BOOKMARK_TO_TIDDLER: {
                if(options.context === EContextType.PAGE){

                    await tiddler.addBookmark(tabInfo);
                    const response = await tiddler.submit();
                    if (response.ok) {
                        const tiddlerTitle = tiddler.getTiddlerTitle();
                        await notify(
                            `Bookmark has been added to ${tiddlerTitle} tiddler.`
                        );
                    }
                }
            }
        }
    }
}

export default TiddlerDispatcher;
