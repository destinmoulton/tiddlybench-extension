import _ from "lodash";
import md5 from "md5";
import AbstractStorage, { StorageElement } from "./AbstractStorage";

interface IOpenEditor {
    id: string;
    url: string;
    title: string;
    tags: string;
    content: string;
}
interface IEditorCache extends StorageElement {
    open_editors: IOpenEditor[];
}
class EditorCache extends AbstractStorage<IEditorCache> {
    _settingDefaults: IEditorCache;
    _storageKey: string;

    constructor() {
        super();
        this._settingDefaults = {
            open_editors: [],
        };

        this._storageKey = "editorcache";
    }

    async createNewEditor(url: string, title: string, content: string) {
        const editor = {
            id: md5(url),
            url,
            title,
            tags: "",
            content,
        };

        const editors = await this.get("open_editors");

        editors.push(editor);

        this.set("open_editors", editors);
    }

    async getEditorByURL(url: string) {
        const id = md5(url);
        return this.getEditorByID(id);
    }

    async getEditorByID(id: string) {
        const editors = await this.get("open_editors");
        const editor = editors.filter(
            (editor: IOpenEditor) => editor.id === id
        );
        return editor.pop();
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

export default new EditorCache();
