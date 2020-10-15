import { browser } from "webextension-polyfill-ts";
async function notify(content: string) {
    const id = await browser.notifications.create({
        iconUrl: "/icon.png",
        title: "TiddlyBench",
        message: content,
        type: "basic",
    });

    // Remove the notification after a bit
    setTimeout(async () => {
        await browser.notifications.clear(id);
    }, 5000);
}

export default notify;
