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
class BackgroundActions {
    _api: API;
    _configStorage: ConfigStorage;

    constructor(api: API, configStorage: ConfigStorage) {
        this._api = api;
        this._configStorage = configStorage;
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
                    const res = await this.addTextToJournal(data.packet.text);
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
                    const res = await this.addTextToInbox(data.packet.text);
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

    async addTextToJournal(text: string) {
        const journal = new Journal(this._configStorage, this._api);
        await journal.initialize();
        await journal.addText(text);
        return await journal.submit();
    }

    async addTextToInbox(text: string) {
        const inbox = new Inbox(this._configStorage, this._api);
        await inbox.initialize();
        await inbox.addText(text);
        return await inbox.submit();
    }
}
export default BackgroundActions;
