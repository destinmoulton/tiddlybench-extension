import HTMLTemplate from "./HTMLTemplate";
class QuickAddTiddler extends HTMLTemplate {
    display() {
        console.log("running display");
        const html = this._compile("tmpl-quickadd-tiddler", {});
        console.log(html);
        this._append(html);

        // Focus on the textarea
        const $textarea = document.getElementById("tb-popup-quickadd-contents");
        if ($textarea) {
            $textarea.focus();
        }
    }
}

export default new QuickAddTiddler();
