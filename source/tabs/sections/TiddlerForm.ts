/**
 * TiddlerForm.ts
 *
 *
 */
import AbstractTabSection from "./AbstractTabSection";
import API from "../../lib/API";
import dom from "../../lib/dom";
import ContextMenuStorage from "../../lib/storage/ContextMenuStorage";
import Messenger from "../../lib/Messenger";
import TabsManager from "../../lib/TabsManager";
import { IDispatchOptions } from "../../types";

import {
    EContextType,
    EDestinationTiddler,
    EDispatchAction,
    EDispatchSource,
} from "../../enums";
export default class TiddlerForm extends AbstractTabSection {
    _contextMenuStorage: ContextMenuStorage;
    _messenger: Messenger;
    _tabsManager: TabsManager;
    _$addbutton: HTMLInputElement | null;

    constructor(
        api: API,
        contextMenuStorage: ContextMenuStorage,
        messenger: Messenger,
        tabsManager: TabsManager
    ) {
        super(api);
        this._contextMenuStorage = contextMenuStorage;
        this._messenger = messenger;
        this._tabsManager = tabsManager;

        this._$addbutton = null;

    }

    async display() {

        const compiled = this._compile("tmpl-tiddler-form", {});

        this._render(compiled);
        
        this._$addbutton = <HTMLInputElement>dom("#tb-tiddler-form-submit");
        if(this._$addbutton){
            this._$addbutton.addEventListener("click", this._handleButtonAddTiddler.bind(this));
        }
        
    }

    _disableButtons(){
        if(!this._$addbutton){
            throw new Error("TiddlerForm :: The add button was not found in the dom.");
        }
        this._$addbutton.disabled = true;
    }

    _enableButtons(){
        if(!this._$addbutton){
            throw new Error("TiddlerForm :: The add button was not found in the dom.");
        }
        this._$addbutton.disabled = false;
    }

    _showError(errorText: string){
        const $error = <HTMLElement>dom("#tb-tiddler-form-error");
        if(!$error){
            throw new Error("TiddlerForm :: The error element in the dom could not be found.");
        }
        $error.innerHTML = errorText;
    }

    async _handleButtonAddTiddler(){

        const $tiddlerTitle = <HTMLInputElement>dom("#tb-tiddler-title");
        const $tiddlerTags = <HTMLInputElement>dom("#tb-tiddler-tags");

        this._showError("");
        if($tiddlerTitle.value !== ""){

            this._disableButtons();
            const res = await this._api.getTiddler($tiddlerTitle.value);
            if(res.ok){
                this._enableButtons();

                this._showError("A Tiddler with that title already exists.")
                
            } else {
                const params = this._getHashParams();
                const cache_id = <string>params.get("cache_id");
                const message: IDispatchOptions = {
                    source: EDispatchSource.TAB,
                    action: EDispatchAction.ADD_TIDDLER_WITH_TEXT,
                    destination: EDestinationTiddler.CUSTOM,
                    context: EContextType.SELECTION,
                    packet: {
                        cache_id,
                        tiddler_title: $tiddlerTitle.value,
                        tiddler_tags: $tiddlerTags.value
                    },
                };
                this._messenger.send(message, async (response) => {
                    if (response.ok) {
                        await this._contextMenuStorage.removeCacheByID(
                            cache_id
                        );
                        await this._tabsManager.closeThisTab();
                    }
                });
            }
        }
    }
}
