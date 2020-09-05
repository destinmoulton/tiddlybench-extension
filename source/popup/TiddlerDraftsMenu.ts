import tiddlerdrafts from "../lib/storage/tiddlerdrafts";
import HTMLTemplate from "./HTMLTemplate";
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

    clickDraftHandler(e: Event) {
        console.log((<HTMLElement>e.target).getAttribute("data-draft-id"));
    }
}

export default TiddlerDraftsMenu;
