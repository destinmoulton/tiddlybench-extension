import { browser } from "webextension-polyfill-ts";

import API from "./API";
import ConfigStorage from "./storage/ConfigStorage";
import notify from "./notify";
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
        responseHandler?: (message: any) => any,
        errorHandler?: () => any
    ) {
        const sending = browser.runtime.sendMessage(message);
        if (responseHandler && errorHandler) {
            return sending.then(responseHandler, errorHandler);
        } else if (responseHandler) {
            return sending.then(responseHandler, this._handleError);
        } else {
            return sending.then(this._handleSuccess, this._handleError);
        }
    }

    _handleSuccess(response: any) {
        if (response.message) {
            // Notify the user
            notify(response.message);
        }
    }

    _handleError(error: any) {
        console.error("Messenger :: _handleError", error);
    }
}
export default Messenger;
