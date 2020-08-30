import HTMLTemplate from "./HTMLTemplate";
import mainmenu from "./MainMenu";
import logger from "../lib/logger";

interface IFormData {
    title: string;
    tags: string;
    contents: string;
}
class TiddlerForm extends HTMLTemplate {
    formData: IFormData;
    $title: HTMLInputElement;
    $tags: HTMLInputElement;
    $contents: HTMLInputElement;
    $title_error: HTMLElement;
    $contents_error: HTMLElement;

    constructor() {
        super();
        this.formData = { title: "", tags: "", contents: "" };
        this.$title = <HTMLInputElement>{};
        this.$tags = <HTMLInputElement>{};
        this.$contents = <HTMLInputElement>{};
        this.$title_error = <HTMLInputElement>{};
        this.$contents_error = <HTMLInputElement>{};
    }

    poupulateDOMElements() {
        this.$title = <HTMLInputElement>(
            document.getElementById("tiddler-title")
        );
        this.$tags = <HTMLInputElement>document.getElementById("tiddler-tags");
        this.$contents = <HTMLInputElement>(
            document.getElementById("tiddler-contents")
        );
        this.$title_error = <HTMLElement>(
            document.getElementById("tiddler-title-error")
        );
        this.$contents_error = <HTMLElement>(
            document.getElementById("tiddler-contents-error")
        );
        if (!this.$title) {
            logger.error(
                "tiddler-title form element is not defined in the DOM"
            );
        }

        if (!this.$tags) {
            logger.error("tiddler-tags form element is not defined in the DOM");
        }
        if (!this.$contents) {
            logger.error(
                "tiddler-contents form element is not defined in the DOM"
            );
        }

        if (!this.$title_error) {
            logger.error("tiddler-title-error DOM element is not defined.");
        }
        if (!this.$contents_error) {
            logger.error("tiddler-contents-error DOM element is not defined.");
        }
    }
    show() {
        const html = this._compile("tmpl-tiddler-form", {});

        this._render(html);

        const $cancel = document.getElementById("tb-tiddler-form-cancel");
        const $save = document.getElementById("tb-tiddler-form-save");

        this.poupulateDOMElements();

        if ($cancel) {
            $cancel.addEventListener("click", this.cancel.bind(this));
        }

        if ($save) {
            $save.addEventListener("click", this.saveTiddler.bind(this));
        }
    }

    getFormData(): IFormData {
        return {
            title: this.$title.value.trim(),
            tags: this.$tags.value.trim(),
            contents: this.$contents.value.trim(),
        };
    }

    resetErrors() {
        this.$title_error.innerText = "";
        this.$title_error.style.display = "none";
        this.$contents_error.innerText = "";
        this.$contents_error.style.display = "none";
    }

    validate(formData: IFormData): boolean {
        this.resetErrors();
        if (formData.title === "") {
            this.$title_error.innerText = "You must include a title.";
            this.$title_error.style.display = "inline-block";
            return false;
        }

        if (formData.contents === "") {
            this.$contents_error.innerText =
                "You must include some contents for your tiddler.";
            this.$contents_error.style.display = "inline-block";
            return false;
        }

        return true;
    }

    populateForm(overrideData: IFormData) {
        this.$title.value = overrideData.title;
        this.$tags.value = overrideData.tags;
        this.$contents.value = overrideData.contents;
    }

    saveTiddler() {
        const formData = this.getFormData();

        const ok = this.validate(formData);
        if (ok) {
            this._loadingAnimation("Saving...");
            this._cancelLoadingAnimation();
            this.poupulateDOMElements();
            this.populateForm(formData);
        }
    }

    cancel() {
        mainmenu.show();
    }
}

export default new TiddlerForm();
