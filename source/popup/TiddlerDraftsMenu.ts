import tiddlerdrafts from "../lib/storage/tiddlerdrafts";
import HTMLTemplate from "./HTMLTemplate";

import { browser } from "webextension-polyfill-ts";
import editortabs from "../lib/editortabs";
class TiddlerDraftsMenu extends HTMLTemplate {
    async display() {
        const tiddlers = await tiddlerdrafts.getAllDrafts();

        let list = [];

        for (let tiddler of tiddlers) {
            list.push(
                this._compile("tmpl-tiddler-draft-menu-item", {
                    draft_id: tiddler.draft_id,
                    draft_title: tiddler.title,
                })
            );
        }

        console.log(list);

        const containerHTML = this._compile("tmpl-tiddler-drafts-menu", {
            draft_list: list.join(""),
        });

        this._render(containerHTML);
        this.setupEventListeners();
    }

    setupEventListeners() {
        const $draftlist_tiddlers = <HTMLElement[]>[
            ...document.querySelectorAll(".tb-draftlist-tiddler"),
        ];

        for (let $tiddler of $draftlist_tiddlers) {
            $tiddler.addEventListener(
                "click",
                this.clickDraftHandler.bind(this)
            );
        }
    }

    async clickDraftHandler(e: Event) {
        const draft_id = (<HTMLElement>e.target).getAttribute("data-draft-id");

        if (draft_id) {
            const tiddler = await tiddlerdrafts.getTiddlerByDraftID(draft_id);
            const tab = await editortabs.getTabByID(parseInt(tiddler.tab_id));
            if (tab) {
                const options = { tabs: [tab.index] };
                console.log(options);
                try {
                    await browser.tabs.highlight(options);
                } catch (err) {
                    alert("Unable to find that tab.");
                    console.error(err);
                }
            } else {
                alert("Unable to find that tab.");
            }
        }
    }
}

export default TiddlerDraftsMenu;
