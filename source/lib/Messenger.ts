import { browser } from "webextension-polyfill-ts";

import notify from "./notify";
class Messenger {
    public setupListener(
        listener: (
            data: any,
            sender: browser.runtime.MessageSender
        ) => Promise<any>
    ) {
        /**
         * The addListener event handler MUST return a
         * Promise (resolve or reject)
         */
        browser.runtime.onMessage.addListener(listener);
    }

    public async send(
        message: any,
        responseHandler?: (message: any) => any,
        errorHandler?: () => any
    ) {
        const sending = browser.runtime.sendMessage(message);
        if (responseHandler && errorHandler) {
            return sending.then(responseHandler, errorHandler);
        } else if (responseHandler) {
            return sending.then(responseHandler, this.handleError);
        } else {
            return sending.then(this.handleSuccess, this.handleError);
        }
    }

    private handleSuccess(response: any) {
        if (response.message) {
            // Notify the user
            notify(response.message);
        }
    }

    private handleError(error: any) {
        console.error("Messenger :: _handleError", error);
    }
}
export default Messenger;
