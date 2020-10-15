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
import { IDispatchOptions, ITiddlerItem } from "../../types";
import {
    EContextType,
    EDestinationTiddler,
    EDispatchAction,
    EDispatchSource,
} from "../../enums";
export default class ListTiddlers extends AbstractTabSection {
    _contextMenuStorage: ContextMenuStorage;
    _messenger: Messenger;
    _tabsManager: TabsManager;
    _tiddlers: ITiddlerItem[];

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
        this._tiddlers = [];
    }

    async display() {
        this._loadingAnimation("Getting Tiddlers...");
        if (!this._api.isServerUp) {
            return;
        }
        const tiddlers = await this._api.getAllTiddlers();
        const liTmpl = "tmpl-list-tiddlers-item";

        const listItems = [];
        for (let i = 0; i < tiddlers.length; i++) {
            const tiddler = tiddlers[i];

            // Generate an id from the title
            // Yeah md5 isn't perfect, but it is good enough...
            const tb_id = md5(tiddler.title);

            // Build the filterable string
            let filterable = this._convertToFilterable(tiddler["title"]);
            tiddlers[i]["tb_id"] = tb_id;
            tiddlers[i]["tb_filterable_title"] = filterable;

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

        this._tiddlers = tiddlers;
        this._render(compiled);

        this._setupFilterInput();
        this._setupTiddlerClickHandler();
    }

    _getTiddlerById(tiddlerId: string): ITiddlerItem | undefined {
        return this._tiddlers.find(
            (el: ITiddlerItem) => el.tb_id === tiddlerId
        );
    }

    _setupTiddlerClickHandler() {
        const $tiddlers = <HTMLElement[]>dom(".tb-tabs-tiddlers-list-item");

        for (let $tiddler of $tiddlers) {
            $tiddler.addEventListener("click", async (e: Event) => {
                const id = (<HTMLElement>e.target).getAttribute(
                    "data-tiddler-id"
                );
                const urlParams = this._getHashParams();
                const cache_id = urlParams.get("cache_id");
                if (id && cache_id) {
                    const tiddler = this._getTiddlerById(id);
                    if (tiddler) {
                        await this._contextMenuStorage.addCustomDestination(
                            tiddler
                        );
                        const message: IDispatchOptions = {
                            source: EDispatchSource.TAB,
                            action: EDispatchAction.ADD_TEXT,
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
        const $filter = <HTMLElement>dom("#tb-tabs-list-filter");
        $filter.focus();
        $filter.addEventListener(
            "keyup",
            _.debounce(this._handleFilter.bind(this), 200)
        );
    }

    _showAllTiddlers() {
        const $lis = <HTMLElement[]>dom(".tb-tabs-tiddlers-list-item");
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

        for (let tiddler of this._tiddlers) {
            if (tiddler.tb_filterable_title) {
                const $item = <HTMLElement>(
                    dom("#tb-tabs-list-tiddler-" + tiddler.tb_id)
                );
                if (tiddler.tb_filterable_title.includes(search)) {
                    $item.style.display = "block";
                } else {
                    $item.style.display = "none";
                }
            }
        }
    }

    _convertToFilterable(text: string): string {
        return text
            .trim()
            .toLowerCase()
            .replace(/[^0-9a-z]/g, "");
    }
}
