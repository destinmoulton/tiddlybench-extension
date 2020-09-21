/**
 * ListTiddlers.ts
 *
 * @class ListTiddlers
 *
 */
import _ from "lodash";

import AbstractTabSection from "./AbstractTabSection";
import API from "../../lib/API";
import dom from "../../lib/dom";
import { ITiddlerItem } from "../../types";
export default class ListTiddlers extends AbstractTabSection {
    _tiddlers: ITiddlerItem[];

    constructor(api: API) {
        super(api);
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

            // Build the filterable string
            let filterable = this._convertToFilterable(tiddler["title"]);
            tiddlers[i]["id"] = i;
            tiddlers[i]["filterable"] = filterable;

            // Compile the template
            const cmp = this._compile(liTmpl, {
                id: i,
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
            if (tiddler.filterable) {
                const $item = <HTMLElement>(
                    dom("#tb-tabs-list-tiddler-" + tiddler.id)
                );
                if (tiddler.filterable.includes(search)) {
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
