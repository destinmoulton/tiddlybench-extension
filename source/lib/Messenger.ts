import { browser } from "webextension-polyfill-ts";

import API from "./API";
import ConfigStorage from "./storage/ConfigStorage";

class Messenger {
    _api: API;
    _configStorage: ConfigStorage;

    constructor(api: API, configStorage: ConfigStorage) {
        this._api = api;
        this._configStorage = configStorage;
    }
    setupListener(
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
