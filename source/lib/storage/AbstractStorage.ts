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
    protected abstract storageDefaults: T;
    protected abstract storageKey: string;

    public async setAll(settings: T) {
        return browser.storage.local.set({ [this.storageKey]: settings });
    }

    public async getAll(): Promise<T> {
        const setObj: any = await (<Promise<any>>(
            browser.storage.local.get(this.storageKey)
        ));

        if (setObj.hasOwnProperty(this.storageKey)) {
            return <T>setObj[this.storageKey];
        }

        try {
            // There is nothing, so set the default value
            await this.setAll(this.storageDefaults);
        } catch (err) {
            throw err;
        }

        return this.storageDefaults;
    }

    public async set(key: keyof T, value: any) {
        const settings: T = await this.getAll();

        console.log(settings);
        if (!settings.hasOwnProperty(key)) {
            throw new Error(`${key} is not defined as a setting.`);
        }

        settings[key] = value;

        return await this.setAll(settings);
    }

    public async get(key: string): Promise<any> {
        const settings = await this.getAll();

        if (!settings.hasOwnProperty(key)) {
            throw new Error(`${key} is not defined as a possible setting.`);
        }

        return settings[key];
    }
}

export default AbstractStorage;
