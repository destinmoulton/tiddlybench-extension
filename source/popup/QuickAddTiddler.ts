import HTMLTemplate from "./HTMLTemplate";
import Messenger from "../lib/Messenger";
import dom from "../lib/dom";
class QuickAddTiddler extends HTMLTemplate {
    _messenger: Messenger;
    $container: HTMLElement | null;
    $textarea: HTMLInputElement | null;
    $type: HTMLInputElement | null;

    constructor(messenger: Messenger) {
        super();
        this._messenger = messenger;
        this.$container = null;
        this.$textarea = null;
        this.$type = null;
    }

    display() {
        const html = this._compile("tmpl-quickadd-tiddler", {});
        this._append(html);

        // Get the main container
        this.$container = <HTMLElement>dom("#tb-popup-quickadd-box");

        // Focus on the textarea
        this.$textarea = <HTMLInputElement>dom("#tb-popup-quickadd-contents");
        this.$textarea.focus();

        // Get the select box element
        this.$type = <HTMLInputElement>dom("#tb-popup-quickadd-type");

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
                    if (this.$type) {
                        this._messenger.send(
                            {
                                dispatch: "tiddler",
                                type: this.$type.value,
                                packet: { text },
                            },
                            this.handleSubmitResponse.bind(this)
                        );
                    } else {
                        console.error(
                            "No Quick Add type value found in the dropdown select."
                        );
                    }
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

export default QuickAddTiddler;
