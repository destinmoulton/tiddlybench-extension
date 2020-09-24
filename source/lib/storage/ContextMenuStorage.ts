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
import { EContextMenuBlockType, EContextMenuStorageKeys } from "../../enums";
import { ICustomDestination, ISelectionCache, ITiddlerItem } from "../../types";
//import { v4 } from "uuid";

interface IContextMenuCache extends StorageElement {
    [EContextMenuStorageKeys.DESTINATIONS]: ICustomDestination[];
    [EContextMenuStorageKeys.SELECTION_CACHE]: ISelectionCache | null;
    [EContextMenuStorageKeys.SELECTED_BLOCK_TYPE]: string;
}
class ContextMenuStorage extends AbstractStorage<IContextMenuCache> {
    _configStorage: ConfigStorage;
    _storageDefaults: IContextMenuCache;
    _storageKey: string;

    constructor(configStorage: ConfigStorage) {
        super();
        this._configStorage = configStorage;

        this._storageDefaults = {
            [EContextMenuStorageKeys.DESTINATIONS]: [],
            [EContextMenuStorageKeys.SELECTION_CACHE]: null,
            [EContextMenuStorageKeys.SELECTED_BLOCK_TYPE]:
                EContextMenuBlockType.QUOTE,
        };

        this._storageKey = "context_menu_cache";
    }
    async setSelectedBlockType(type: string) {
        await this.set(EContextMenuStorageKeys.SELECTED_BLOCK_TYPE, type);
    }

    async getSelectedBlockType() {
        return await this.get(EContextMenuStorageKeys.SELECTED_BLOCK_TYPE);
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
        await this.set(EContextMenuStorageKeys.SELECTION_CACHE, cache);
    }

    async getSelectionCache() {
        return await this.get(EContextMenuStorageKeys.SELECTION_CACHE);
    }

    /**
     * The selection cache should be cleared
     * soon after retrieval.
     */
    async clearSelectionCache() {
        return await this.set(EContextMenuStorageKeys.SELECTION_CACHE, null);
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
            this.set(EContextMenuStorageKeys.DESTINATIONS, currentDestinations);
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
            await this.get(EContextMenuStorageKeys.DESTINATIONS)
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
