import { browser } from "webextension-polyfill-ts";

class Messenger {
    setup() {
        browser.runtime.onMessage.addListener(this.messageHandler);
    }

    messageHandler(message: any, sender: browser.runtime.MessageSender) {
        if (message.type === "console.log") {
            if (message.showSender) {
                console.log(sender);
            }
            console.log(message.contents);
        }
        return;
    }

    send(message: any) {
        const sending = browser.runtime.sendMessage(message);
        sending.then(this._handleResponse, this._handleError);
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
