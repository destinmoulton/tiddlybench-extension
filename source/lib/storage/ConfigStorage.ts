import _ from "lodash";
import AbstractStorage, { StorageElement } from "./AbstractStorage";

interface ISettings extends StorageElement {
    url: string;
    username: string;
    password: string;
    inbox_tiddler_title: string;
    journal_tiddler_title: string;
    journal_tiddler_tags: string;
    bookmark_prefix: string;
    bookmark_suffix: string;
    quickadd_inbox_text_prefix: string;
    quickadd_inbox_text_suffix: string;
    quickadd_journal_text_prefix: string;
    quickadd_journal_text_suffix: string;
    selection_inbox_text_prefix: string;
    selection_inbox_text_suffix: string;
    selection_journal_text_prefix: string;
    selection_journal_text_suffix: string;
    selection_customdestination_text_prefix: string;
    selection_customdestination_text_suffix: string;
    context_menu_visibility: string;
    context_menu_num_custom_destinations: string;
}
class ConfigStorage extends AbstractStorage<ISettings> {
    _storageDefaults: ISettings;
    _storageKey: string;

    constructor() {
        super();
        this._storageDefaults = {
            url: "",
            username: "",
            password: "",
            inbox_tiddler_title: "Inbox",
            journal_tiddler_title: "Journal",
            journal_tiddler_tags: "journal",
            bookmark_prefix: "{[T|BR]}{[T|BR]}",
            bookmark_suffix: "{[T|BR]}{[T|BR]}",
            quickadd_inbox_text_prefix: "{[T|BR]}{[T|BR]}",
            quickadd_inbox_text_suffix: "{[T|BR]}{[T|BR]}",
            quickadd_journal_text_prefix: "{[T|BR]}{[T|BR]}",
            quickadd_journal_text_suffix: "{[T|BR]}{[T|BR]}",
            selection_inbox_text_prefix: "{[T|BR]}{[T|BR]}<<<{[T|BR]}",
            selection_inbox_text_suffix:
                "{[T|BR]}<<<{[P|SOURCE_LINK]}{[T|BR]}{[T|BR]}",
            selection_journal_text_prefix: "{[T|BR]}{[T|BR]}<<<{[T|BR]}",
            selection_journal_text_suffix:
                "{[T|BR]}<<<{[P|SOURCE_LINK]}{[T|BR]}{[T|BR]}",
            selection_customdestination_text_prefix:
                "{[T|BR]}{[T|BR]}<<<{[T|BR]}",
            selection_customdestination_text_suffix:
                "{[T|BR]}<<<{[P|SOURCE_LINK]}{[T|BR]}{[T|BR]}",
            context_menu_visibility: "on",
            context_menu_num_custom_destinations: "3",
        };

        this._storageKey = "settings";
    }

    async isServerConfigured(): Promise<boolean> {
        const config = await this.getAll();

        if (
            config.url !== "" &&
            config.username !== "" &&
            config.password !== ""
        ) {
            return true;
        }
        return false;
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

export default ConfigStorage;
