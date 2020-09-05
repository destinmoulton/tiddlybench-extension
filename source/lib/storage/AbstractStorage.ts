/**
 * AbtractStorage is a storage wrapper
 *
 * used by config or editor cache
 */

import { browser } from "webextension-polyfill-ts";
import _ from "lodash";

export interface StorageElement {
    [key: string]: any;
}

/** The option name corresponds to the input id */
abstract class AbstractStorage<T extends StorageElement> {
    abstract _storageDefaults: T;
    abstract _storageKey: string;

    async _setAll(settings: T) {
        return browser.storage.local.set({ [this._storageKey]: settings });
    }

    async getAll(): Promise<T> {
        const setObj: any = await (<Promise<any>>(
            browser.storage.local.get(this._storageKey)
        ));

        if (setObj.hasOwnProperty(this._storageKey)) {
            return <T>setObj[this._storageKey];
        }

        try {
            // There is nothing, so set the default value
            await this._setAll(this._storageDefaults);
        } catch (err) {
            throw err;
        }

        return this._storageDefaults;
    }

    async set(key: keyof T, value: any) {
        const settings: T = await this.getAll();

        console.log(settings);
        if (!settings.hasOwnProperty(key)) {
            throw new Error(`${key} is not defined as a setting.`);
        }

        settings[key] = value;

        return await this._setAll(settings);
    }

    async get(key: string): Promise<any> {
        const settings = await this.getAll();

        if (!settings.hasOwnProperty(key)) {
            throw new Error(`${key} is not defined as a possible setting.`);
        }

        return settings[key];
    }
}

export default AbstractStorage;
