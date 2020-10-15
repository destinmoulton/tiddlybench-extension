import ConfigStorage from "../lib/storage/ConfigStorage";
import PopupTemplate from "./PopupTemplate";
import Messenger from "../lib/Messenger";
import dom from "../lib/dom";
import { BLOCK_TYPES } from "../constants";
import {
    EBlockType,
    EConfigKey,
    EContextType,
    EDestinationTiddler,
    EDispatchAction,
    EDispatchSource,
} from "../enums";
import { IDispatchOptions } from "../types";
class QuickAddTiddler extends PopupTemplate {
    _configStorage: ConfigStorage;
    _messenger: Messenger;

    $container: HTMLElement | null;
    $textarea: HTMLInputElement | null;
    $destination: HTMLInputElement | null;
    $blocktype: HTMLInputElement | null;

    constructor(configStorage: ConfigStorage, messenger: Messenger) {
        super();
        this._configStorage = configStorage;
        this._messenger = messenger;
        this.$container = null;
        this.$textarea = null;
        this.$destination = null;
        this.$blocktype = null;
    }

    display() {
        const html = this._compile("tmpl-quickadd-tiddler", {});
        this._append(html);
    }

    async setup() {
        const defaultDestination = await this._configStorage.get(
            EConfigKey.QUICKADD_DEFAULT_DESTINATION
        );
        const defaultBlockType = await this._configStorage.get(
            EConfigKey.QUICKADD_DEFAULT_BLOCKTYPE
        );
        // Get the main container
        this.$container = <HTMLElement>dom("#tb-popup-quickadd-box");

        // Focus on the textarea
        this.$textarea = <HTMLInputElement>dom("#tb-popup-quickadd-contents");
        this.$textarea.focus();
        this.$textarea.addEventListener(
            "keydown",
            this._handleTextareaKeydown.bind(this)
        );

        // Get the select box element
        this.$destination = <HTMLInputElement>dom("#tb-popup-quickadd-type");
        this.$destination.value = defaultDestination;

        // Build the block type dropdown
        this.$blocktype = <HTMLInputElement>dom("#tb-popup-quickadd-blocktype");
        this.$blocktype.innerHTML = this._getBlockTypesOptionsHTML();
        this.$blocktype.value = defaultBlockType;

        // Setup the handler
        const $submit = <HTMLInputElement>(
            dom("#tb-popup-quickadd-submit-button")
        );
        $submit.addEventListener("click", this.handleClickSubmit.bind(this));
    }

    async handleClickSubmit() {
        if (
            !this.$container ||
            !this.$textarea ||
            !this.$destination ||
            !this.$blocktype
        ) {
            throw new Error("An element was not found in the dom.");
        }
        if (this.validate()) {
            const animation = this._getLoadingAnimationHTML("Adding...");
            this.$container.innerHTML = animation;
            try {
                const blockType = this.$blocktype.value;
                const text = this.$textarea.value;
                const dest = this.$destination.value;
                const msg: IDispatchOptions = {
                    source: EDispatchSource.QUICKADD,
                    action: EDispatchAction.ADD_TEXT,
                    destination: <EDestinationTiddler>dest,
                    context: EContextType.SELECTION,
                    packet: {
                        text,
                        blockType,
                    },
                };
                this._messenger.send(msg);
            } catch (err) {
                console.error(err.message);
            }
        }
    }

    /**
     * Disable the Enter key add new line and
     * instead submit the quick add form.
     */
    async _handleTextareaKeydown(e: KeyboardEvent) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            // Fire on Enter, but not on Shift + Enter
            await this.handleClickSubmit();
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
