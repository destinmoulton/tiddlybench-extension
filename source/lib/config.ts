import { browser } from "webextension-polyfill-ts";
import _ from "lodash";

/** The option name corresponds to the input id */
interface ISettings {
    url: string;
    username: string;
    password: string;
    context_menu_visibility: string;
    [key: string]: ISettings[keyof ISettings];
}
class Config {
    _settingDefaults: ISettings;
    _storageKey: string;

    constructor() {
        this._settingDefaults = {
            url: "",
            username: "",
            password: "",
            context_menu_visibility: "on",
        };

        this._storageKey = "settings";
    }

    async _setAll(settings: ISettings) {
        return browser.storage.local.set({ [this._storageKey]: settings });
    }

    async getAll(): Promise<ISettings> {
        const setObj: any = await (<Promise<any>>(
            browser.storage.local.get(this._storageKey)
        ));

        if (setObj.hasOwnProperty(this._storageKey)) {
            return <ISettings>setObj[this._storageKey];
        }

        try {
            // There is nothing, so set the default value
            await this._setAll(this._settingDefaults);
        } catch (err) {
            throw err;
        }

        return this._settingDefaults;
    }

    async set(key: string, value: any) {
        const settings: ISettings = await this.getAll();
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

    async reset(formID: string) {
        const $form = document.getElementById(formID);
        if (!$form) {
            throw new Error(
                `Unable to reset the form. Cannot find ${formID} in the DOM.`
            );
        }

        const html = $form.innerHTML;

        // Rewrite the html to reset all the even handlers
        $form.innerHTML = html;

        await this._setAll(this._settingDefaults);

        this.syncForm(formID);
    }

    /**
     * Synchronize a form with the settings.
     *
     * @param formID string
     */
    async syncForm(formID: string) {
        const $form = document.getElementById(formID);

        const settings = await this.getAll();

        if (!$form) {
            throw new Error(
                `Cannot sync settings. The form '${formID}' does not exist in the DOM.`
            );
        }

        const inputIDs = Object.keys(this._settingDefaults);

        for (let inputID of inputIDs) {
            const $input: HTMLInputElement = <HTMLInputElement>(
                $form.querySelector(`#${inputID}`)
            );

            if (!$input) {
                throw new Error(
                    `Cannot sync settings. Unable to find '${inputID}' in the form.`
                );
            }

            // Populate from the stored settings
            $input.value = settings[inputID];

            // Setup the event listeners
            if (
                $input.type === "text" ||
                $input.type === "password" ||
                $input.type === "textarea"
            ) {
                // Debounce keyboard input items
                $input.addEventListener(
                    "keyup",
                    _.debounce(this.syncInputElement.bind(this), 200)
                );
            } else if (
                $input.tagName === "SELECT" ||
                $input.type === "radio" ||
                $input.type === "checkbox"
            ) {
                // Run update on change
                $input.addEventListener(
                    "change",
                    this.syncInputElement.bind(this)
                );
            } else {
                throw new Error(
                    "Cannot sync settings. Unable to sync " + $input.tagName
                );
            }
        }
    }

    async syncInputElement(e: Event) {
        if (e.target) {
            const id = (<HTMLInputElement>e.target).id;
            const val = (<HTMLInputElement>e.target).value;

            return this.set(id, val);
        }
    }
}

export default new Config();
