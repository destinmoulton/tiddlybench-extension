import { browser } from "webextension-polyfill-ts";

import journal from "../lib/tiddlers/journal";

class Messenger {
    setupListener() {
        /**
         * The addListener event handler MUST return a
         * Promise (resolve or reject)
         */
        browser.runtime.onMessage.addListener(async (data, sender) => {
            if (data.dispatch === "tiddler") {
                if (data.type === "journal") {
                    await journal.initialize();
                    await journal.addText(data.packet.text);
                    await journal.submit();
                    return Promise.resolve({
                        message: "Journal submitted.",
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
