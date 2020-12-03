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
import { v1 as uuidv1 } from "uuid";
import dayjs from "dayjs";
import AbstractStorage, { StorageElement } from "./AbstractStorage";
import ConfigStorage from "./ConfigStorage";
import { EBlockType, EContextMenuStorageKeys, EConfigKey } from "../../enums";
import {
    ICustomDestination,
    ICustomDestinationTiddler,
    IContextMenuCache,
} from "../../types";
//import { v4 } from "uuid";

interface IContextMenuStorage extends StorageElement {
    [EContextMenuStorageKeys.DESTINATIONS]: ICustomDestination[];
    [EContextMenuStorageKeys.CACHE]: IContextMenuCache[];
    [EContextMenuStorageKeys.SELECTED_BLOCK_TYPE]: string;
}
class ContextMenuStorage extends AbstractStorage<IContextMenuStorage> {
    private configStorage: ConfigStorage;
    protected storageDefaults: IContextMenuStorage;
    storageKey: string;

    constructor(configStorage: ConfigStorage) {
        super();
        this.configStorage = configStorage;

        this.storageDefaults = {
            [EContextMenuStorageKeys.DESTINATIONS]: [],
            [EContextMenuStorageKeys.CACHE]: [],
            [EContextMenuStorageKeys.SELECTED_BLOCK_TYPE]: EBlockType.QUOTE,
        };

        this.storageKey = "context_menu";
    }
    public async setSelectedBlockType(type: string) {
        await this.set(EContextMenuStorageKeys.SELECTED_BLOCK_TYPE, type);
    }

    public async getSelectedBlockType() {
        return await this.get(EContextMenuStorageKeys.SELECTED_BLOCK_TYPE);
    }

    /**
     *
     *
     * @returns string ID for selection cache.
     */
    public async addCache(
        context: string,
        clickData: browser.contextMenus.OnClickData,
        tabData: browser.tabs.Tab | undefined
    ): Promise<string> {
        const cacheID = uuidv1();
        const cache: IContextMenuCache = {
            cacheID,
            context,
            clickData,
            tabData,
        };

        const caches = await this.get(EContextMenuStorageKeys.CACHE);
        caches.push(cache);
        await this.set(EContextMenuStorageKeys.CACHE, caches);
        return cacheID;
    }

    public async removeCacheByID(cacheID: string) {
        const caches = <IContextMenuCache[]>(
            await this.get(EContextMenuStorageKeys.CACHE)
        );
        const newCaches = caches.filter((cache) => cache.cacheID !== cacheID);
        return await this.set(EContextMenuStorageKeys.CACHE, newCaches);
    }

    public async getCacheByID(cacheID: string): Promise<IContextMenuCache> {
        const caches = <IContextMenuCache[]>(
            await this.get(EContextMenuStorageKeys.CACHE)
        );
        return <IContextMenuCache>(
            caches.find((cache) => cache.cacheID === cacheID)
        );
    }

    /**
     * The selection cache should be cleared
     * soon after retrieval.
     */
    public async clearAllSelectionCache() {
        return await this.set(EContextMenuStorageKeys.CACHE, []);
    }

    public async addCustomDestination(tiddler: ICustomDestinationTiddler) {
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
                await this.configStorage.get(
                    EConfigKey.CONTEXTMENU_NUM_CUSTOM_DESTINATIONS
                )
            );

            currentDestinations.unshift(destination);

            if (currentDestinations.length >= numAllowedCurrent) {
                currentDestinations.pop();
            }
            this.set(EContextMenuStorageKeys.DESTINATIONS, currentDestinations);
        }
    }

    public async findDestinationByTitle(tiddlerTitle: string) {
        const destinations = await this.getAllCustomDestinations();

        return destinations.find(
            (dest: ICustomDestination) => dest.tiddler.title === tiddlerTitle
        );
    }
    public async findDestinationById(id: string) {
        const destinations = await this.getAllCustomDestinations();

        return destinations.find(
            (dest: ICustomDestination) => dest.tiddler.tb_id === id
        );
    }

    /**
     * Return a list of the custom destinations
     * sorted by last_addition_time DESC
     */
    public async getAllCustomDestinations(): Promise<ICustomDestination[]> {
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

    public async getCustomDestinationByID(id: string) {
        const destinations = await this.getAllCustomDestinations();
        return destinations.find((dest) => dest.tiddler.tb_id === id);
    }
}

export default ContextMenuStorage;
