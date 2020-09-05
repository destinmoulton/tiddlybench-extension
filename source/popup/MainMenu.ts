import HTMLTemplate from "./HTMLTemplate";
import tiddlerform from "./TiddlerForm";
import tiddlerdrafts from "../lib/storage/tiddlerdrafts";
import TiddlerDraftsMenu from "./TiddlerDraftsMenu";
class MainMenu extends HTMLTemplate {
    show() {
        const html = this._compile("tmpl-main-menu", {});

        this._render(html);

        const $link = document.getElementById("tb-link-add-tiddler");
        if ($link) {
            $link.addEventListener("click", tiddlerform.show.bind(tiddlerform));
        }
        const $clearTiddlerDrafts = document.getElementById(
            "tb-link-clear-tiddler-cache"
        );
        if ($clearTiddlerDrafts) {
            $clearTiddlerDrafts.addEventListener(
                "click",
                tiddlerdrafts.reset.bind(tiddlerdrafts)
            );
        }
        const tiddlerDraftsMenu = new TiddlerDraftsMenu();
        const $tiddlerDrafts = document.getElementById(
            "tb-link-list-tiddler-drafts"
        );
        if ($tiddlerDrafts) {
            $tiddlerDrafts.addEventListener(
                "click",
                tiddlerDraftsMenu.display.bind(tiddlerDraftsMenu)
            );
        }
    }
}

export default new MainMenu();
