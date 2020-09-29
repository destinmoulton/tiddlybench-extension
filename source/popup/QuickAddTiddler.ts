import PopupTemplate from "./PopupTemplate";
import Messenger from "../lib/Messenger";
import dom from "../lib/dom";
import { BLOCK_TYPES } from "../constants";
import { EBlockType } from "../enums";
class QuickAddTiddler extends PopupTemplate {
    _messenger: Messenger;
    $container: HTMLElement | null;
    $textarea: HTMLInputElement | null;
    $type: HTMLInputElement | null;
    $blocktype: HTMLInputElement | null;

    constructor(messenger: Messenger) {
        super();
        this._messenger = messenger;
        this.$container = null;
        this.$textarea = null;
        this.$type = null;
        this.$blocktype = null;
    }

    display() {
        const html = this._compile("tmpl-quickadd-tiddler", {});
        this._append(html);
    }

    setup() {
        // Get the main container
        this.$container = <HTMLElement>dom("#tb-popup-quickadd-box");

        // Focus on the textarea
        this.$textarea = <HTMLInputElement>dom("#tb-popup-quickadd-contents");
        this.$textarea.focus();

        // Get the select box element
        this.$type = <HTMLInputElement>dom("#tb-popup-quickadd-type");

        // Build the block type dropdown
        this.$blocktype = <HTMLInputElement>dom("#tb-popup-quickadd-blocktype");
        this.$blocktype.innerHTML = this._getBlockTypesOptionsHTML();

        // Setup the handler
        const $submit = <HTMLInputElement>(
            dom("#tb-popup-quickadd-submit-button")
        );
        $submit.addEventListener("click", this.handleClickSubmit.bind(this));
    }

    async handleClickSubmit() {
        const animation = this._getLoadingAnimationHTML("Adding...");

        if (
            !this.$container ||
            !this.$textarea ||
            !this.$type ||
            !this.$blocktype
        ) {
            throw new Error("An element was not found in the dom.");
        }
        if (this.validate()) {
            this.$container.innerHTML = animation;
            try {
                const blockType = this.$blocktype.value;
                const text = this.$textarea.value;
                const type = this.$type.value;
                console.log("sending message");
                this._messenger.send(
                    {
                        dispatch: "tiddler",
                        type,
                        packet: { text, blockType },
                    },
                    this.handleSubmitResponse.bind(this)
                );
            } catch (err) {
                console.error(err.message);
            }
        }
    }

    _getBlockTypesOptionsHTML(): string {
        let options = [];
        for (let blockKey in BLOCK_TYPES) {
            const blockName = BLOCK_TYPES[<EBlockType>blockKey];

            const html = this._compile("tmpl-quickadd-blocktype-option", {
                block_type: blockKey,
                block_title: blockName,
            });

            options.push(html);
        }
        return options.join("");
    }

    /**
     * Handle the messenger response
     *
     * @param message any
     */
    handleSubmitResponse(packet: any) {
        if (packet.ok) {
            window.close();
        }
    }

    validate() {
        if (this.$textarea && this.$textarea.value.trim() === "") {
            return false;
        }
        return true;
    }
}

export default QuickAddTiddler;
