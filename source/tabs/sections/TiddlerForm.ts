/**
 * TiddlerForm.ts
 *
 *
 */
import md5 from "md5";
import AbstractTabSection from "./AbstractTabSection";
import API from "../../lib/API";
import dom from "../../lib/dom";
import ContextMenuStorage from "../../lib/storage/ContextMenuStorage";
import Messenger from "../../lib/Messenger";
import TabsManager from "../../lib/TabsManager";
import { IDispatchOptions } from "../../types";
import notify from "../../lib/notify";

import {
    EContextType,
    EDestinationTiddler,
    EDispatchAction,
    EDispatchSource,
} from "../../enums";
export default class TiddlerForm extends AbstractTabSection {
    private contextMenuStorage: ContextMenuStorage;
    private messenger: Messenger;
    private tabsManager: TabsManager;
    private $addButton: HTMLInputElement | null;
    private $cancelButton: HTMLInputElement | null;
    private $tiddlerTitle: HTMLInputElement | null;
    private $tiddlerTags: HTMLInputElement | null;

    constructor(
        api: API,
        contextMenuStorage: ContextMenuStorage,
        messenger: Messenger,
        tabsManager: TabsManager
    ) {
        super(api);
        this.contextMenuStorage = contextMenuStorage;
        this.messenger = messenger;
        this.tabsManager = tabsManager;

        this.$addButton = null;
        this.$cancelButton = null;
        this.$tiddlerTitle = null;
        this.$tiddlerTags = null;
    }

    async display() {
        const compiled = this.compile("tmpl-tiddler-form", {});

        this.render(compiled);

        this.$tiddlerTitle = <HTMLInputElement>dom.el("#tb-tiddler-title");
        this.$tiddlerTitle.focus();
        this.$tiddlerTags = <HTMLInputElement>dom.el("#tb-tiddler-tags");

        this.$addButton = <HTMLInputElement>dom.el("#tb-tiddler-form-submit");
        if (this.$addButton) {
            this.$addButton.addEventListener(
                "click",
                this.handleButtonAddTiddler.bind(this)
            );
        }

        this.$cancelButton = <HTMLInputElement>(
            dom.el("#tb-tiddler-form-cancel")
        );
        if (this.$cancelButton) {
            this.$cancelButton.addEventListener(
                "click",
                this.handleButtonCancel.bind(this)
            );
        }
    }

    private async handleButtonCancel() {
        const params = this.getHashParams();
        await this.tabsManager.openTiddlerPicker(
            <string>params.get("cache_id"),
            false
        );
    }

    private disableButtons() {
        if (!this.$addButton) {
            throw new Error(
                "TiddlerForm :: The add button was not found in the dom."
            );
        }
        this.$addButton.disabled = true;
    }

    private enableButtons() {
        if (!this.$addButton) {
            throw new Error(
                "TiddlerForm :: The add button was not found in the dom."
            );
        }
        this.$addButton.disabled = false;
    }

    private showError(errorText: string) {
        const $error = <HTMLElement>dom.el("#tb-tiddler-form-error");
        if (!$error) {
            throw new Error(
                "TiddlerForm :: The error element in the dom could not be found."
            );
        }
        $error.innerHTML = errorText;
    }

    private async handleButtonAddTiddler() {
        this.showError("");
        if (this.$tiddlerTitle && this.$tiddlerTitle.value !== "") {
            this.disableButtons();
            const res = await this.api.getTiddler(this.$tiddlerTitle.value);
            if (res.ok) {
                this.enableButtons();

                this.showError("A Tiddler with that title already exists.");
            } else {
                const params = this.getHashParams();
                const cache_id = <string>params.get("cache_id");
                const newTiddlerTitle = this.$tiddlerTitle.value;
                let tiddlerTags = "";
                if (this.$tiddlerTags && this.$tiddlerTags.value !== "") {
                    tiddlerTags = this.$tiddlerTags.value;
                }
                const message: IDispatchOptions = {
                    source: EDispatchSource.TAB,
                    action: EDispatchAction.ADD_TIDDLER_WITH_TEXT,
                    destination: EDestinationTiddler.CUSTOM,
                    context: EContextType.SELECTION,
                    packet: {
                        cache_id,
                        tiddler_title: newTiddlerTitle,
                        tiddler_tags: tiddlerTags,
                    },
                };
                this.messenger.send(message, async (response) => {
                    if (response.ok) {
                        await this.contextMenuStorage.removeCacheByID(cache_id);

                        // Add the new tiddler to the context menu
                        await this.contextMenuStorage.addCustomDestination({
                            title: newTiddlerTitle,
                            tb_id: md5(newTiddlerTitle),
                        });
                        notify(response.message);
                        await this.tabsManager.closeThisTab();
                    }
                });
            }
        }
    }
}
