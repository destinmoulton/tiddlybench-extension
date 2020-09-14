import HTMLTemplate from "./HTMLTemplate";
//import formatit from "../lib/formatting/formatit";
//import config from "../lib/storage/config";
import dom from "../lib/dom";
//import { browser } from "webextension-polyfill-ts";
import messenger from "../lib/messenger";
class QuickAddTiddler extends HTMLTemplate {
    $container: HTMLElement | null;
    $textarea: HTMLInputElement | null;

    constructor() {
        super();
        this.$container = null;
        this.$textarea = null;
    }

    display() {
        console.log("running display");
        const html = this._compile("tmpl-quickadd-tiddler", {});
        console.log(html);
        this._append(html);

        this.$container = <HTMLElement>dom("#tb-popup-quickadd-box");

        // Focus on the textarea
        this.$textarea = <HTMLInputElement>dom("#tb-popup-quickadd-contents");
        this.$textarea.focus();

        // Setup the handler
        const $submit = <HTMLElement>dom("#tb-popup-quickadd-submit-button");
        $submit.addEventListener("click", this.handleClickSubmit.bind(this));
    }

    async handleClickSubmit() {
        const animation = this._getLoadingAnimationHTML("Adding...");

        if (this.$container) {
            if (this.validate()) {
                const text = this.$textarea ? this.$textarea.value : "";
                this.$container.innerHTML = animation;
                try {
                    messenger.send(
                        {
                            dispatch: "tiddler",
                            type: "journal",
                            packet: { text },
                        },
                        this.handleSubmitResponse.bind(this)
                    );
                    // await browser.notifications.create({
                    //     type: "basic",
                    //     iconUrl: "../icon.png",
                    //     message: "Validated",
                    //     title: "Test title",
                    // });
                } catch (err) {
                    console.error(err.message);
                }
            }
        }
    }

    /**
     * Handle the messenger response
     *
     * @param message any
     */
    handleSubmitResponse(message: any) {
        console.log("handleSubmitResponse", message);
    }

    validate() {
        if (this.$textarea && this.$textarea.value.trim() === "") {
            return false;
        }
        return true;
    }
}

export default new QuickAddTiddler();
