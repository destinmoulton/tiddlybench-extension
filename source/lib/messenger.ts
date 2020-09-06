import { browser } from "webextension-polyfill-ts";

class Messenger {
    setupListener() {
        console.log("setupListener() called");
        browser.runtime.onMessage.addListener((data, sender) => {
            console.log("message received");
            console.log(data, sender);
        });
    }

    messageHandler(message: any, sender: browser.runtime.MessageSender) {
        console.log("message received");
        console.log(message, sender);
    }

    send(message: any) {
        browser.runtime.sendMessage(message);
    }

    log(...args: any[]) {
        this.send({ type: "console.log", contents: args });
    }

    _handleResponse(response: any) {
        console.log("Messenger() :: _handleResponse :: ", response);
    }

    _handleError(error: any) {
        console.error(error);
    }
}
export default new Messenger();
