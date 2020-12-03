import _ from "lodash";
import AbstractStorage from "./AbstractStorage";
import { EConfigKey } from "../../enums";

type TSettings = {
    [key in EConfigKey]: string;
};
class ConfigStorage extends AbstractStorage<TSettings> {
    storageDefaults: TSettings;
    storageKey: string;

    constructor() {
        super();
        this.storageDefaults = {
            [EConfigKey.SERVER_URL]: "",
            [EConfigKey.SERVER_USERNAME]: "",
            [EConfigKey.SERVER_PASSWORD]: "",
            [EConfigKey.TIDDLER_INBOX_TITLE]: "Inbox",
            [EConfigKey.TIDDLER_JOURNAL_TITLE]:
                "Journal {[MMM]} {[DD]}, {[YYYY]}",
            [EConfigKey.TIDDLER_JOURNAL_TAGS]: "journal",
            [EConfigKey.BOOKMARK_TIDDLER_TITLE]: "Bookmarks",
            [EConfigKey.BOOKMARK_PREFIX]: "{[BR]}{[BR]}",
            [EConfigKey.BOOKMARK_MARKDOWN]: "[[{[TITLE]}|{[URL]}]]",
            [EConfigKey.BOOKMARK_SUFFIX]: "{[BR]}{[BR]}",
            [EConfigKey.BLOCK_QUOTE_PREFIX]: "{[BR]}{[BR]}<<<{[BR]}",
            [EConfigKey.BLOCK_QUOTE_SUFFIX]: "{[BR]}<<<{[LINK]}{[BR]}{[BR]}",
            [EConfigKey.BLOCK_CODE_PREFIX]: "{[BR]}{[BR]}```{[BR]}",
            [EConfigKey.BLOCK_CODE_SUFFIX]: "{[BR]}{[BR]}```{[BR]}",
            [EConfigKey.BLOCK_PARAGRAPH_PREFIX]: "{[BR]}{[BR]}",
            [EConfigKey.BLOCK_PARAGRAPH_SUFFIX]: "{[BR]}{[BR]}",
            [EConfigKey.BLOCK_ULITEM_PREFIX]: "{[BR]}*{[SP]}{[SP]}",
            [EConfigKey.BLOCK_ULITEM_SUFFIX]: "{[BR]}{[BR]}",
            [EConfigKey.BLOCK_OLITEM_PREFIX]: "{[BR]}#{[SP]}{[SP]}",
            [EConfigKey.BLOCK_OLITEM_SUFFIX]: "{[BR]}{[BR]}",
            [EConfigKey.CONTEXTMENU_NUM_CUSTOM_DESTINATIONS]: "3",
            [EConfigKey.QUICKADD_DEFAULT_DESTINATION]: "journal",
            [EConfigKey.QUICKADD_DEFAULT_BLOCKTYPE]: "ulitem",
        };

        this.storageKey = "settings";
    }

    public async isServerConfigured(): Promise<boolean> {
        const config = await this.getAll();

        if (
            config[EConfigKey.SERVER_URL] !== "" &&
            config[EConfigKey.SERVER_USERNAME] !== "" &&
            config[EConfigKey.SERVER_PASSWORD] !== ""
        ) {
            return true;
        }
        return false;
    }

    public async reset(formID: string) {
        const $form = document.getElementById(formID);
        if (!$form) {
            throw new Error(
                `Unable to reset the form. Cannot find ${formID} in the DOM.`
            );
        }

        const html = $form.innerHTML;

        // Rewrite the html to reset all the even handlers
        $form.innerHTML = html;

        await this.setAll(this.storageDefaults);

        this.syncForm(formID);
    }

    /**
     * Synchronize a form with the settings.
     *
     * @param formID string
     */
    public async syncForm(formID: string) {
        const $form = document.getElementById(formID);

        const settings = await this.getAll();

        if (!$form) {
            throw new Error(
                `Cannot sync settings. The form '${formID}' does not exist in the DOM.`
            );
        }

        const inputIDs = Object.keys(this.storageDefaults);

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

            $input.value = settings[<EConfigKey>inputID];

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

    public async syncInputElement(e: Event) {
        if (e.target) {
            const id = (<HTMLInputElement>e.target).id;
            const val = (<HTMLInputElement>e.target).value;

            return this.set(<EConfigKey>id, val);
        }
    }
}

export default ConfigStorage;
