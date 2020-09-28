import { browser } from "webextension-polyfill-ts";
async function notify(content: string) {
    return browser.notifications.create({
        iconUrl: "/icon.png",
        title: "TiddlyBench",
        message: content,
        type: "basic",
    });
}

export default notify;
