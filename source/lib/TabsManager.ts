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
    [EExtensionURL.TiddlerForm]: "tabs/tabs.html#section=tiddler_form",
};
export default class TabsManager {
    async openListTiddlersTab(cacheID: string, newTab: boolean = true) {
        const url =
            EXTENSION_URL[EExtensionURL.ChooseTiddler] + "&cache_id=" + cacheID;
        if (newTab) {
            return await this.openTab(url);
        } else {
            window.location.href = "/" + url + "&cache_id=" + cacheID;
            return true;
        }
    }
    async openTiddlerForm(contextCacheID: string, newTab: boolean = false) {
        const url = EXTENSION_URL[EExtensionURL.TiddlerForm];
        if (newTab) {
            return await this.openTab(url);
        } else {
            window.location.href = "/" + url + "&cache_id=" + contextCacheID;
            return true;
        }
    }
    async openSettingsTab() {
        return await this.openTab(EXTENSION_URL[EExtensionURL.Settings]);
    }
    async openTab(url: string) {
        // We only want one version of a tab existing
        await this.closeCurrentTabsForURL(url);

        return browser.tabs.create({ url });
    }

    async closeCurrentTabsForURL(url: string) {
        const tabs = await this.findTabsByURL(url);

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

    async findTabsByURL(url: string) {
        const partial = url;
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

    async closeThisTab() {
        const tab = await browser.tabs.getCurrent();
        if (tab && tab.id) {
            return await browser.tabs.remove(tab.id);
        }
    }
}
