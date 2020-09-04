import { browser } from "webextension-polyfill-ts";
import editorcache from "./storage/editorcache";
class EditorTabs {
    async getAll() {
        return await browser.tabs.query({});
    }

    async create(sourceURL: string, sourceTitle: string, content: string) {
        let tabURL = "editor/editor.html";
        const tabInfo = await browser.tabs.create({ url: tabURL });

        if (tabInfo.id) {
            await editorcache.add(tabInfo.id, sourceURL, sourceTitle, content);
            const hashURL = tabURL + "#id=" + tabInfo.id;
            await browser.tabs.update(tabInfo.id, { url: hashURL });
        }
    }
}

export default new EditorTabs();
