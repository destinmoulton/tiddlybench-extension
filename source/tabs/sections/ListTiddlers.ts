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
import { IDispatchOptions } from "../../types";
import {
    EContextType,
    EDestinationTiddler,
    EDispatchAction,
    EDispatchSource,
} from "../../enums";
import notify from "../../lib/notify";

// Custom interface for each tiddler item
interface IListTiddlerItem {
    title: string;
    tb_id: string;

    tb_filterable_title: string;
}

export default class ListTiddlers extends AbstractTabSection {
    private contextMenuStorage: ContextMenuStorage;
    private messenger: Messenger;
    private tabsManager: TabsManager;
    private listTiddlers: IListTiddlerItem[];
    private isCreateNewTiddlerVisible: boolean;
    private isCreateNewTiddlerListenerEnabled: boolean;
    private $filterInput: HTMLInputElement | null;

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
        this.listTiddlers = [];
        this.isCreateNewTiddlerVisible = false;
        this.isCreateNewTiddlerListenerEnabled = false;
        this.$filterInput = null;
    }

    async display() {
        console.log("running display() for ListTiddlers");

        this.loadingAnimation("Getting Tiddlers...");
        if (!this.api.isServerUp) {
            return;
        }

        const tiddlers = await this.api.getAllTiddlers();
        const liTmpl = "tmpl-list-tiddlers-item";

        const listItems = [];
        let listOfTiddlers: IListTiddlerItem[] = [];
        for (let i = 0; i < tiddlers.length; i++) {
            const tiddler = tiddlers[i];

            // Generate an id from the title
            // Yeah md5 isn't perfect, but it is good enough...
            const tb_id = md5(tiddler.title);

            // Build the filterable string
            let filterable = this.convertToFilterable(tiddler["title"]);
            listOfTiddlers.push({
                title: tiddler.title,
                tb_id,
                tb_filterable_title: filterable,
            });

            // Compile the template
            const cmp = this.compile(liTmpl, {
                id: tb_id,
                tiddler_title: tiddler.title,
            });
            listItems.push(cmp);
        }

        const compiled = this.compile("tmpl-list-tiddlers", {
            tiddlers: listItems.join(""),
        });

        this.listTiddlers = listOfTiddlers;
        this.render(compiled);

        this.setupFilterInput();
        this.setupTiddlerClickHandler();
    }

    private getTiddlerById(tiddlerId: string): IListTiddlerItem | undefined {
        return this.listTiddlers.find(
            (el: IListTiddlerItem) => el.tb_id === tiddlerId
        );
    }

    private setupTiddlerClickHandler() {
        const $tiddlers = dom.els(".tb-tabs-tiddlers-list-item");

        for (let $tiddler of $tiddlers) {
            $tiddler.addEventListener("click", async (e: Event) => {
                const id = (<HTMLElement>e.target).getAttribute(
                    "data-tiddler-id"
                );
                const cache_id = this.getCacheID();
                if (id && cache_id) {
                    const tiddler = this.getTiddlerById(id);
                    if (tiddler) {
                        // Add it to the context menu
                        await this.contextMenuStorage.addCustomDestination({
                            title: tiddler.title,
                            tb_id: tiddler.tb_id,
                        });

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
                        this.messenger.send(message, async (response) => {
                            if (response.ok) {
                                await this.contextMenuStorage.removeCacheByID(
                                    cache_id
                                );
                                notify(response.message);
                                await this.tabsManager.closeThisTab();
                            }
                        });
                    } else {
                        throw new Error(`Unable to find tiddler with id ${id}`);
                    }
                }
            });
        }
    }

    private setupFilterInput() {
        this.$filterInput = <HTMLInputElement>(
            dom.el("#tb-tabs-list-filter-input")
        );
        this.$filterInput.focus();
        this.$filterInput.addEventListener(
            "keyup",
            _.debounce(this.handleFilterKeyup.bind(this), 200)
        );
    }

    private showAllTiddlers() {
        const $lis = dom.els(".tb-tabs-tiddlers-list-item");
        for (let $li of $lis) {
            $li.style.display = "block";
        }
    }

    private handleFilterKeyup(e: KeyboardEvent) {
        const $filter = <HTMLInputElement>e.target;

        if (e.code === "Enter") {
            if (this.isCreateNewTiddlerVisible) {
                // Convert the filter box into a form
                this.showForm();
            }
            return;
        }

        const search = this.convertToFilterable($filter.value);

        if (search === "") {
            this.showAllTiddlers();
            return;
        }

        let isTiddlerFound = false;
        for (let tiddler of this.listTiddlers) {
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

        if (!isTiddlerFound) {
            this.showAddTiddlerBox();
        } else {
            this.hideAddTiddlerBox();
        }
    }

    private hideAddTiddlerBox() {
        const $el = <HTMLElement>dom.el("#tb-tabs-list-add-new-tiddler-box");
        $el.classList.remove("animate-fade-in");
        $el.classList.add("animate-hidden");

        this.isCreateNewTiddlerVisible = false;
    }

    private showAddTiddlerBox() {
        this.isCreateNewTiddlerVisible = true;
        const $el = <HTMLElement>dom.el("#tb-tabs-list-add-new-tiddler-box");
        const $notfound = <HTMLElement>dom.el("#tb-tlan-notfound");

        if (this.$filterInput) {
            $notfound.innerText =
                '"' + this.$filterInput.value + '" not found.';
        }

        // Only fade it in if it is invisible
        if ($el.classList.contains("animate-hidden")) {
            $el.classList.remove("animate-hidden");
            $el.classList.add("animate-fade-in");
        }

        if (!this.isCreateNewTiddlerListenerEnabled) {
            $el.addEventListener("click", this.showForm.bind(this));
            this.isCreateNewTiddlerListenerEnabled = true;
        }
    }

    private convertToFilterable(text: string): string {
        return text
            .trim()
            .toLowerCase()
            .replace(/[^0-9a-z]/g, "");
    }

    showForm() {
        this.hideAddTiddlerBox();
        const $formEl = dom.el("#tb-tabs-list-formend-container");
        if ($formEl) {
            $formEl.classList.remove("animate-hidden");
            $formEl.classList.add("animate-fade-in");
        }
    }
}
