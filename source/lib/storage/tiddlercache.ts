import _ from "lodash";
import AbstractStorage, { StorageElement } from "./AbstractStorage";
import { ITiddlyEditor } from "../../types";

interface ITiddlerCache extends StorageElement {
    cached_tiddlers: ITiddlyEditor[];
}
class TiddlerCache extends AbstractStorage<ITiddlerCache> {
    _settingDefaults: ITiddlerCache;
    _storageKey: string;
    _cacheKey: string;

    constructor() {
        super();
        this._cacheKey = "cached_tiddlers";
        this._settingDefaults = {
            cached_tiddlers: [],
        };

        this._storageKey = "editorcache";
    }

    async add(tab_id: number, url: string, title: string, content: string) {
        const editor = {
            tab_id,
            url,
            title,
            tags: "",
            content,
        };

        const editors = await this.get(this._cacheKey);

        editors.push(editor);

        this.set(this._cacheKey, editors);
    }

    async getTiddlerByTabID(tab_id: string) {
        const editors = await this.get(this._cacheKey);
        const editor = editors.filter(
            (editor: ITiddlyEditor) => editor.tab_id === tab_id
        );
        return editor.pop();
    }

    async reset() {
        await this._setAll(this._settingDefaults);
    }

    async updateTiddler(tab_id: string, tiddler: ITiddlyEditor) {
        const tiddlers = await this.get(this._cacheKey);
        for (let i = 0; i < tiddlers.length; i++) {
            const tid = tiddlers[i];
            if (tid.tab_id == tab_id) {
                tiddlers[i] = tiddler;
            }
        }
        await this.set(this._cacheKey, tiddlers);
    }
}

export default new TiddlerCache();
