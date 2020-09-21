/**
 * TabsManager.ts
 *
 * @class TabsManager
 *
 * Manage the extensions tabs.
 * Open tabs, find tabs, and insure that
 * only one tab of a type exist.
 */
import { browser } from "webextension-polyfill-ts";
import { EExtensionURL } from "../enums";
const EXTENSION_URL = {
    [EExtensionURL.Popup]: browser.runtime.getURL("popup/popup.html"),
    [EExtensionURL.Settings]: "options/options.html",
    [EExtensionURL.ChooseTiddler]: "tabs/tabs.html#section=choose_tiddler",
};
export default class TabsManager {
    async openTab(urlKey: EExtensionURL) {
        if (!EXTENSION_URL.hasOwnProperty(urlKey)) {
            throw new Error(
                `Trying to create a tab for a url that has not been defined. ${urlKey} does not exist.`
            );
        }

        // We only want one version of a tab existing
        await this.closeCurrentTabsForURL(urlKey);

        return browser.tabs.create({ url: EXTENSION_URL[urlKey] });
    }

    async closeCurrentTabsForURL(urlKey: EExtensionURL) {
        const tabs = await this.findTabsByURL(urlKey);

        console.log(
            `Finding tabs to close for ${EXTENSION_URL[urlKey]}...`,
            tabs
        );
        let tabsToClose = [];
        for (let tab of tabs) {
            if (!tab.active) {
                tabsToClose.push(tab.id);
            }
        }
        if (tabsToClose.length) {
            browser.tabs.remove(<number[]>tabsToClose);
        }
    }

    async findTabsByURL(urlKey: EExtensionURL) {
        const partial = EXTENSION_URL[urlKey];
        const tabs = await this.getAll();
        const foundTabs = [];
        for (let tab of tabs) {
            if (tab.url && tab.url.includes(partial)) {
                foundTabs.push(tab);
            }
        }
        return foundTabs;
    }

    async getAll() {
        return await browser.tabs.query({});
    }

    async doesTabExist(tab_id: number) {
        const tabs = await this.getAll();

        return tabs.some((tab) => tab.id === tab_id);
    }

    async getTabByID(tab_id: number): Promise<browser.tabs.Tab | undefined> {
        const tabs = await this.getAll();
        const results = tabs.filter((tab) => tab.id === tab_id);
        if (results.length > 0) {
            return results.pop();
        }
        return undefined;
    }
}
