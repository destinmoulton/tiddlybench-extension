/**
 * InitialOptions.ts
 * 
 * Initial options for selecting a tiddler.
 * 
 * @class InitialOptions
 */

import AbstractTabSection from "./AbstractTabSection";

import API from "../../lib/API";
import dom from "../../lib/dom";
import TabsManager from "../../lib/TabsManager";

export default class InitialOptions extends AbstractTabSection {
    _tabsManager: TabsManager;

    constructor(api: API, tabsManager: TabsManager){
        super(api);
        this._tabsManager = tabsManager;
    }

    async display(){

        const compiled = this._compile("tmpl-tiddler-options", {});
        this._render(compiled);
        
        this._setupEventListeners();
    }

    _setupEventListeners(){

        const $addButton = <HTMLElement>dom("#tb-tabs-option-add-tiddler");
        const $listButton = <HTMLElement>dom("#tb-tabs-option-select-tiddler");

        if($addButton){
            $addButton.addEventListener("click", ()=>{
                const cache_id = this._getCacheID();
                this._tabsManager.openTiddlerForm(cache_id);
            })
        }
        if($listButton){
            $listButton.addEventListener("click", ()=>{
                const cache_id = this._getCacheID();
                this._tabsManager.openListTiddlersTab(cache_id, false);
            })
        }
    }
}
