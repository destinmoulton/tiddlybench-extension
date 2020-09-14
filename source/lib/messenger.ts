import { browser } from "webextension-polyfill-ts";

import journal from "../lib/tiddlers/journal";
import inbox from "../lib/tiddlers/inbox";

class Messenger {
    setupListener() {
        /**
         * The addListener event handler MUST return a
         * Promise (resolve or reject)
         */
        browser.runtime.onMessage.addListener(async (data, sender) => {
            if (data.dispatch === "tiddler") {
                switch (data.type) {
                    case "journal":
                        await journal.initialize();
                        await journal.addText(data.packet.text);
                        await journal.submit();
                        return Promise.resolve({
                            ok: true,
                            message: "Journal submitted.",
                        });
                    case "inbox":
                        await inbox.initialize();
                        await inbox.addText(data.packet.text);
                        await inbox.submit();
                        return Promise.resolve({
                            ok: true,
                            message: "Inbox submitted.",
                        });
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
export default new Messenger();
