import { browser } from "webextension-polyfill-ts";
import _ from "lodash";
import tiddlerdrafts from "./storage/tiddlerdrafts";
class EditorTabs {
    async getAll() {
        return await browser.tabs.query({});
    }

    async create(sourceURL: string, sourceTitle: string, content: string) {
        let tabURL = "editor/editor.html";
        const tabInfo = await browser.tabs.create({ url: tabURL });

        if (tabInfo.id) {
            await tiddlerdrafts.add(
                tabInfo.id,
                sourceURL,
                sourceTitle,
                content
            );
            const hashURL = tabURL + "#id=" + tabInfo.id;
            await browser.tabs.update(tabInfo.id, { url: hashURL });
        }
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

    /**
     * Synchronize a form with the settings.
     *
     * @param formID string
     */
    async syncForm(formID: string, tab_id: string) {
        const $form = document.getElementById(formID);
        const tiddler = await tiddlerdrafts.getTiddlerByTabID(tab_id);

        if (!$form) {
            throw new Error(
                `Cannot sync settings. The form '${formID}' does not exist in the DOM.`
            );
        }

        const inputIDs = Object.keys(tiddler);

        for (let inputID of inputIDs) {
            const $input: HTMLInputElement = <HTMLInputElement>(
                $form.querySelector(`#${inputID}`)
            );

            if (!$input) {
                throw new Error(
                    `Cannot sync settings. Unable to find '${inputID}' in the form.`
                );
            }

            // Populate from the stored settings
            $input.value = tiddler[inputID];

            // Setup the event listeners
            if (
                $input.type === "text" ||
                $input.type === "password" ||
                $input.type === "textarea"
            ) {
                // Debounce keyboard input items
                $input.addEventListener(
                    "keyup",
                    _.debounce(this.syncInputElement.bind(this, tab_id), 200)
                );
            } else if (
                $input.tagName === "SELECT" ||
                $input.type === "radio" ||
                $input.type === "checkbox"
            ) {
                // Run update on change
                $input.addEventListener(
                    "change",
                    this.syncInputElement.bind(this, tab_id)
                );
            } else {
                throw new Error(
                    "Cannot sync settings. Unable to sync " + $input.tagName
                );
            }
        }
    }

    async syncInputElement(tab_id: string, e: Event) {
        if (e.target) {
            const id = (<HTMLInputElement>e.target).id;
            const val = (<HTMLInputElement>e.target).value;

            const tiddler = await tiddlerdrafts.getTiddlerByTabID(tab_id);
            tiddler[id] = val;
            await tiddlerdrafts.updateTiddler(tab_id, tiddler);
        }
    }
}

export default new EditorTabs();
