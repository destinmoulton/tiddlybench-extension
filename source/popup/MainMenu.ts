import HTMLTemplate from "./HTMLTemplate";

class MainMenu extends HTMLTemplate {
    show() {
        const html = this._compile("tmpl-main-menu", {});

        this._render(html);

        const $link = document.getElementById("tb-link-add-tiddler");
        if ($link) {
            $link.addEventListener("click", this.showTiddlerForm.bind(this));
        }
    }
}

export default new MainMenu();
