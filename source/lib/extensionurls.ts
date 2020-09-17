import { browser } from "webextension-polyfill-ts";

const urls = {
    popup: browser.runtime.getURL("popup/popup.html"),
    settings: "options/options.html",
};

export async function openSettingsTab() {
    return browser.tabs.create({ url: urls.settings });
}
export default {
    ...urls,
    openSettingsTab,
};
