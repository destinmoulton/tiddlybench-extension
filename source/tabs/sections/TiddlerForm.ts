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
    _contextMenuStorage: ContextMenuStorage;
    _messenger: Messenger;
    _tabsManager: TabsManager;
    _$addButton: HTMLInputElement | null;
    _$cancelButton: HTMLInputElement | null;
    _$tiddlerTitle: HTMLInputElement | null;
    _$tiddlerTags: HTMLInputElement | null;

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

        this._$addButton = null;
        this._$cancelButton = null;
        this._$tiddlerTitle = null;
        this._$tiddlerTags = null;

    }

    async display() {

        const compiled = this._compile("tmpl-tiddler-form", {});

        this._render(compiled);

        this._$tiddlerTitle = <HTMLInputElement>dom("#tb-tiddler-title");
        this._$tiddlerTitle.focus();
        this._$tiddlerTags = <HTMLInputElement>dom("#tb-tiddler-tags");
        
        this._$addButton = <HTMLInputElement>dom("#tb-tiddler-form-submit");
        if(this._$addButton){
            this._$addButton.addEventListener("click", this._handleButtonAddTiddler.bind(this));
        }
        
        this._$cancelButton = <HTMLInputElement>dom("#tb-tiddler-form-cancel");
        if(this._$cancelButton){

            this._$cancelButton.addEventListener("click", this._handleButtonCancel.bind(this));
        }
    }

    async _handleButtonCancel(){
            const params = this._getHashParams();
            await this._tabsManager.openListTiddlersTab(<string>params.get("cache_id"), false);
    }

    _disableButtons(){
        if(!this._$addButton){
            throw new Error("TiddlerForm :: The add button was not found in the dom.");
        }
        this._$addButton.disabled = true;
    }

    _enableButtons(){
        if(!this._$addButton){
            throw new Error("TiddlerForm :: The add button was not found in the dom.");
        }
        this._$addButton.disabled = false;
    }

    _showError(errorText: string){
        const $error = <HTMLElement>dom("#tb-tiddler-form-error");
        if(!$error){
            throw new Error("TiddlerForm :: The error element in the dom could not be found.");
        }
        $error.innerHTML = errorText;
    }

    async _handleButtonAddTiddler(){


        this._showError("");
        if(this._$tiddlerTitle && this._$tiddlerTitle.value !== ""){

            this._disableButtons();
            const res = await this._api.getTiddler(this._$tiddlerTitle.value);
            if(res.ok){
                this._enableButtons();

                this._showError("A Tiddler with that title already exists.")
                
            } else {
                const params = this._getHashParams();
                const cache_id = <string>params.get("cache_id");
                const newTiddlerTitle = this._$tiddlerTitle.value;
                let tiddlerTags = "";
                if(this._$tiddlerTags && this._$tiddlerTags.value !== ""){
                    tiddlerTags = this._$tiddlerTags.value;
                }
                const message: IDispatchOptions = {
                    source: EDispatchSource.TAB,
                    action: EDispatchAction.ADD_TIDDLER_WITH_TEXT,
                    destination: EDestinationTiddler.CUSTOM,
                    context: EContextType.SELECTION,
                    packet: {
                        cache_id,
                        tiddler_title: newTiddlerTitle,
                        tiddler_tags:tiddlerTags 
                    },
                };
                this._messenger.send(message, async (response) => {
                    if (response.ok) {
                        await this._contextMenuStorage.removeCacheByID(
                            cache_id
                        );

                        // Add the new tiddler to the context menu
                        await this._contextMenuStorage.addCustomDestination(
                            {title: newTiddlerTitle, tb_id: md5(newTiddlerTitle)}
                        );
                        notify(response.message);
                        await this._tabsManager.closeThisTab();
                    }
                });
            }
        }
    }
}
