import { browser } from "webextension-polyfill-ts";

const urls = {
    popup: browser.runtime.getURL("popup/popup.html"),
    settings: "options/options.html",
};

async function openSettingsTab() {
    console.log("openSettingsTab running");
    return browser.tabs.create({ url: urls.settings });
}
export default {
    ...urls,
    openSettingsTab,
};
