/**
 * ContextMenusStorage.ts
 *
 * @class ContextMenusStorage
 *
 * Store information about additional
 * context menus available for the user.
 *
 * The user can add destination tiddlers that
 * are available via the TiddlyBench context menu.
 */
import _ from "lodash";
import AbstractStorage, { StorageElement } from "./AbstractStorage";
import ConfigStorage from "./ConfigStorage";
import { ICustomDestination, ISelectionCache } from "../../types";
//import { v4 } from "uuid";

interface IContextMenuCache extends StorageElement {
    destinations: ICustomDestination[];
    selection_cache: ISelectionCache | null;
}
class ContextMenuStorage extends AbstractStorage<IContextMenuCache> {
    _configStorage: ConfigStorage;
    _storageDefaults: IContextMenuCache;
    _storageKey: string;
    _cacheKey: string;
    _destinationsKey: string;

    constructor(configStorage: ConfigStorage) {
        super();
        this._configStorage = configStorage;
        this._cacheKey = "selection_cache";
        this._destinationsKey = "destinations";
        this._storageDefaults = {
            destinations: [],
            selection_cache: null,
        };

        this._storageKey = "context_menu_cache";
    }

    async addSelectionCache(pageUrl: string, pageTitle: string) {
        const cache = {
            page_url: pageUrl,
            page_title: pageTitle,
        };
        await this.set(this._cacheKey, cache);
    }

    async getSelectionCache() {
        return await this.get(this._cacheKey);
    }

    async addCustomDestination(tiddlerTitle: string) {}
}

export default ContextMenuStorage;
