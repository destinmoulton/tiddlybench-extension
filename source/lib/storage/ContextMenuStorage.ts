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
import dayjs from "dayjs";
import AbstractStorage, { StorageElement } from "./AbstractStorage";
import ConfigStorage from "./ConfigStorage";
import { ICustomDestination, ISelectionCache, ITiddlerItem } from "../../types";
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

    async addSelectionCache(
        pageUrl: string,
        pageTitle: string,
        selectedText: string
    ) {
        const cache = {
            page_url: pageUrl,
            page_title: pageTitle,
            selected_text: selectedText,
        };
        await this.set(this._cacheKey, cache);
    }

    async getSelectionCache() {
        return await this.get(this._cacheKey);
    }

    /**
     * The selection cache should be cleared
     * soon after retrieval.
     */
    async clearSelectionCache() {
        return await this.set(this._cacheKey, null);
    }

    async addCustomDestination(tiddler: ITiddlerItem) {
        const destination: ICustomDestination = {
            tiddler,
            last_addition_time: dayjs().unix(),
        };

        // Check if the destination already exists
        const possibleDest = await this.findDestinationByTitle(tiddler.title);
        if (!possibleDest) {
            const currentDestinations = await this.getAllCustomDestinations();

            // Get the configured number of custom
            // destinations that are allowed in the
            // context menu
            const numAllowedCurrent = parseInt(
                await this._configStorage.get(
                    "context_menu_num_custom_destinations"
                )
            );

            currentDestinations.unshift(destination);

            if (currentDestinations.length >= numAllowedCurrent) {
                currentDestinations.pop();
            }
            this.set(this._destinationsKey, currentDestinations);
        }
    }

    async findDestinationByTitle(tiddlerTitle: string) {
        const destinations = await this.getAllCustomDestinations();

        return destinations.find(
            (dest: ICustomDestination) => dest.tiddler.title === tiddlerTitle
        );
    }
    async findDestinationById(id: string) {
        const destinations = await this.getAllCustomDestinations();

        return destinations.find(
            (dest: ICustomDestination) => dest.tiddler.tb_id === id
        );
    }

    /**
     * Return a list of the custom destinations
     * sorted by last_addition_time DESC
     */
    async getAllCustomDestinations(): Promise<ICustomDestination[]> {
        const dests = <ICustomDestination[]>(
            await this.get(this._destinationsKey)
        );

        return dests.sort((a: ICustomDestination, b: ICustomDestination) => {
            if (a.last_addition_time < b.last_addition_time) {
                return -1;
            }

            if (a.last_addition_time > b.last_addition_time) {
                return -1;
            }
            return 0;
        });
    }
}

export default ContextMenuStorage;
