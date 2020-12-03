/**
 * ListTiddlers.ts
 *
 * @class ListTiddlers
 *
 */
import _ from "lodash";
import md5 from "md5";

import AbstractTabSection from "./AbstractTabSection";
import API from "../../lib/API";
import dom from "../../lib/dom";
import ContextMenuStorage from "../../lib/storage/ContextMenuStorage";
import Messenger from "../../lib/Messenger";
import TabsManager from "../../lib/TabsManager";
import { IDispatchOptions} from "../../types";
import {
    EContextType,
    EDestinationTiddler,
    EDispatchAction,
    EDispatchSource,
} from "../../enums";
import notify from "../../lib/notify";

// Custom interface for each tiddler item
interface IListTiddlerItem {
    title: string,
    tb_id: string;

    tb_filterable_title: string;
}

export default class ListTiddlers extends AbstractTabSection {
    _contextMenuStorage: ContextMenuStorage;
    _messenger: Messenger;
    _tabsManager: TabsManager;
    _listTiddlers: IListTiddlerItem[];

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
        this._listTiddlers = [];
    }

    async display() {
        console.log("running display() for ListTiddlers");

        this._loadingAnimation("Getting Tiddlers...");
        if (!this._api.isServerUp) {
            return;
        }
        const tiddlers = await this._api.getAllTiddlers();
        const liTmpl = "tmpl-list-tiddlers-item";

        const listItems = [];
        let listOfTiddlers: IListTiddlerItem[] = [];
        for (let i = 0; i < tiddlers.length; i++) {
            const tiddler = tiddlers[i];

            // Generate an id from the title
            // Yeah md5 isn't perfect, but it is good enough...
            const tb_id = md5(tiddler.title);

            // Build the filterable string
            let filterable = this._convertToFilterable(tiddler["title"]);
            listOfTiddlers.push({
                title: tiddler.title,
                tb_id,
                tb_filterable_title: filterable
            })

            // Compile the template
            const cmp = this._compile(liTmpl, {
                id: tb_id,
                tiddler_title: tiddler.title,
            });
            listItems.push(cmp);
        }

        const compiled = this._compile("tmpl-list-tiddlers", {
            tiddlers: listItems.join(""),
        });

        this._listTiddlers = listOfTiddlers;
        this._render(compiled);

        this._setupFilterInput();
        this._setupTiddlerClickHandler();
    }

    _getTiddlerById(tiddlerId: string): IListTiddlerItem | undefined {
        return this._listTiddlers.find(
            (el: IListTiddlerItem) => el.tb_id === tiddlerId
        );
    }

    _setupAddTiddlerClickHandler() {
        const $button = <HTMLElement>dom.el("#tb-add-tiddler-button");
        if ($button) {
            $button.addEventListener("click", () => {
                const cache_id = this._getCacheID();
                this._tabsManager.openTiddlerForm(cache_id, false);
            });
        }
    }

    _setupTiddlerClickHandler() {
        const $tiddlers = dom.els(".tb-tabs-tiddlers-list-item");

        for (let $tiddler of $tiddlers) {
            $tiddler.addEventListener("click", async (e: Event) => {
                const id = (<HTMLElement>e.target).getAttribute(
                    "data-tiddler-id"
                );
                const cache_id = this._getCacheID();
                if (id && cache_id) {
                    const tiddler = this._getTiddlerById(id);
                    if (tiddler) {
                        // Add it to the context menu
                        await this._contextMenuStorage.addCustomDestination(
                            {title: tiddler.title, tb_id: tiddler.tb_id}
                        );

                        // Dispatch the message to add the text
                        const message: IDispatchOptions = {
                            source: EDispatchSource.TAB,
                            action: EDispatchAction.ADD_TEXT_TO_TIDDLER,
                            destination: EDestinationTiddler.CUSTOM,
                            context: EContextType.SELECTION,
                            packet: {
                                cache_id: cache_id,
                                tiddler_id: tiddler.tb_id,
                                tiddler_title: tiddler.title,
                            },
                        };
                        this._messenger.send(message, async (response) => {
                            if (response.ok) {
                                await this._contextMenuStorage.removeCacheByID(
                                    cache_id
                                );
                                notify(response.message);
                                await this._tabsManager.closeThisTab();
                            }
                        });
                    } else {
                        throw new Error(`Unable to find tiddler with id ${id}`);
                    }
                }
            });
        }
    }

    _setupFilterInput() {
        const $filter = <HTMLElement>dom.el("#tb-tabs-list-filter");
        $filter.focus();
        $filter.addEventListener(
            "keyup",
            _.debounce(this._handleFilter.bind(this), 200)
        );
    }

    _showAllTiddlers() {
        const $lis = dom.els(".tb-tabs-tiddlers-list-item");
        for (let $li of $lis) {
            $li.style.display = "block";
        }
    }

    _handleFilter(e: Event) {
        const $filter = <HTMLInputElement>e.target;
        const search = this._convertToFilterable($filter.value);

        if (search === "") {
            this._showAllTiddlers();
            return;
        }

        let isTiddlerFound = false;
        for (let tiddler of this._listTiddlers) {
            if (tiddler.tb_filterable_title) {
                const $item = <HTMLElement>(
                    dom.el("#tb-tabs-list-tiddler-" + tiddler.tb_id)
                );
                if (tiddler.tb_filterable_title.includes(search)) {
                    isTiddlerFound = true;
                    $item.style.display = "block";
                } else {
                    $item.style.display = "none";
                }
            }
        }

        if(!isTiddlerFound){
            this._showAddTiddlerOption();
        }
    }

    _showAddTiddlerOption(){
        console.log("_showAddTiddlerOption running");
        const $el = dom.el("#tb-tabs-list-add-new-tiddler-box");
        if($el.classList.contains("animate-invisible-state")){

            $el.classList.remove("animate-invisible-state");
            $el.classList.add("animate-fade-in");
        }
    }

    _convertToFilterable(text: string): string {
        return text
            .trim()
            .toLowerCase()
            .replace(/[^0-9a-z]/g, "");
    }
}
