import { browser } from "webextension-polyfill-ts";

import ConfigStorage from "./storage/ConfigStorage";
import Journal from "./tiddlers/Journal";
import Inbox from "./tiddlers/Inbox";

class Messenger {
    _configStorage: ConfigStorage;

    constructor(configStorage: ConfigStorage) {
        this._configStorage = configStorage;
    }
    setupListener() {
        /**
         * The addListener event handler MUST return a
         * Promise (resolve or reject)
         */
        browser.runtime.onMessage.addListener(async (data, sender) => {
            if (data.dispatch === "tiddler") {
                switch (data.type) {
                    case "journal": {
                        const journal = new Journal(this._configStorage);
                        await journal.initialize();
                        await journal.addText(data.packet.text);
                        const res = await journal.submit();
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
                        const inbox = new Inbox(this._configStorage);
                        await inbox.initialize();
                        await inbox.addText(data.packet.text);
                        const res = await inbox.submit();
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
        });
    }

    async send(
        message: any,
        responseHandler: (message: any) => any,
        errorHandler?: () => any
    ) {
        const sending = browser.runtime.sendMessage(message);
        if (responseHandler && errorHandler) {
            return sending.then(responseHandler, errorHandler);
        } else {
            return sending.then(responseHandler, this._handleError);
        }
    }

    _handleError(error: any) {
        console.error("Messenger :: _handleError", error);
    }
}
export default Messenger;
