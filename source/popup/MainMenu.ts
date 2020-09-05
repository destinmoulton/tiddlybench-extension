import HTMLTemplate from "./HTMLTemplate";
import tiddlerform from "./TiddlerForm";
import tiddlercache from "../lib/storage/tiddlercache";
class MainMenu extends HTMLTemplate {
    show() {
        const html = this._compile("tmpl-main-menu", {});

        this._render(html);

        const $link = document.getElementById("tb-link-add-tiddler");
        if ($link) {
            $link.addEventListener("click", tiddlerform.show.bind(tiddlerform));
        }
        const $clearTiddlerCache = document.getElementById(
            "tb-link-clear-tiddler-cache"
        );
        if ($clearTiddlerCache) {
            $clearTiddlerCache.addEventListener(
                "click",
                tiddlercache.reset.bind(tiddlercache)
            );
        }
    }
}

export default new MainMenu();
