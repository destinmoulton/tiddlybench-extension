import _ from "lodash";
import AbstractStorage, { StorageElement } from "./AbstractStorage";

interface ISettings extends StorageElement {
    url: string;
    username: string;
    password: string;
    inbox_tiddler_title: string;
    inbox_tiddler_prefix: string;
    inbox_tiddler_suffix: string;
    journal_tiddler_title: string;
    journal_tiddler_tags: string;
    journal_tiddler_prefix: string;
    journal_tiddler_suffix: string;
    context_menu_visibility: string;
}
class Config extends AbstractStorage<ISettings> {
    _storageDefaults: ISettings;
    _storageKey: string;

    constructor() {
        super();
        this._storageDefaults = {
            url: "",
            username: "",
            password: "",
            inbox_tiddler_title: "Inbox",
            inbox_tiddler_prefix: "\n\n",
            inbox_tiddler_suffix: "\n\n",
            journal_tiddler_title: "Journal",
            journal_tiddler_tags: "journal",
            journal_tiddler_prefix: "\n\n",
            journal_tiddler_suffix: "\n\n",
            context_menu_visibility: "on",
        };

        this._storageKey = "settings";
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

        await this._setAll(this._storageDefaults);

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

        const inputIDs = Object.keys(this._storageDefaults);

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
