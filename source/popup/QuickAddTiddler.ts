import HTMLTemplate from "./HTMLTemplate";
class QuickAddTiddler extends HTMLTemplate {
    $container: HTMLElement | undefined;

    constructor() {
        super();
        this.$container = undefined;
    }

    display() {
        console.log("running display");
        const html = this._compile("tmpl-quickadd-tiddler", {});
        console.log(html);
        this._append(html);

        this.$container = <HTMLElement>(
            document.getElementById("tb-popup-quickadd-box")
        );

        // Focus on the textarea
        const $textarea = document.getElementById("tb-popup-quickadd-contents");
        if ($textarea) {
            $textarea.focus();
        }

        // Setup the handler
        const $submit = document.getElementById(
            "tb-popup-quickadd-submit-button"
        );
        if ($submit) {
            $submit.addEventListener(
                "click",
                this.handleClickSubmit.bind(this)
            );
        }
    }

    handleClickSubmit() {
        const html = this._getLoadingAnimationHTML("Adding...");

        if (this.$container) {
            this.$container.innerHTML = html;
        }
    }
}

export default new QuickAddTiddler();
