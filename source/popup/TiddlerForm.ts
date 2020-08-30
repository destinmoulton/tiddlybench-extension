import TiddlerTemplate from "./TiddlerTemplate";
class TiddlerForm extends TiddlerTemplate {
    showTiddlerForm() {
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
}

export default new TiddlerForm();
