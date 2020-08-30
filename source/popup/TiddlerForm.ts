import HTMLTemplate from "./HTMLTemplate";
import mainmenu from "./MainMenu";
class TiddlerForm extends HTMLTemplate {
    show() {
        const html = this._compile("tmpl-tiddler-form", {});

        this._render(html);

        const $cancel = document.getElementById("tb-tiddler-form-cancel");
        const $save = document.getElementById("tb-tiddler-form-save");

        if ($cancel) {
            $cancel.addEventListener("click", this.saveTiddler);
        }

        if ($save) {
            $save.addEventListener("click", this.cancel);
        }
    }

    saveTiddler() {
        mainmenu.show();
    }

    cancel() {
        mainmenu.show();
    }
}

export default new TiddlerForm();
