import _ from "lodash";
import AbstractStorage, { StorageElement } from "./AbstractStorage";
import { ITiddlerDraft } from "../../types";
import { v4 } from "uuid";

interface ITiddlerCache extends StorageElement {
    tiddler_drafts: ITiddlerDraft[];
}
class TiddlerDrafts extends AbstractStorage<ITiddlerCache> {
    _storageDefaults: ITiddlerCache;
    _storageKey: string;
    _cacheKey: string;

    constructor() {
        super();
        this._cacheKey = "tiddler_drafts";
        this._storageDefaults = {
            tiddler_drafts: [],
        };

        this._storageKey = "drafts";
    }

    async add(tab_id: number, url: string, title: string, content: string) {
        const editor = {
            tab_id,
            draft_id: v4(),
            url,
            title,
            tags: "",
            content,
        };

        const editors = await this.get(this._cacheKey);

        editors.push(editor);

        this.set(this._cacheKey, editors);
    }

    async getAllDrafts(): Promise<ITiddlerDraft[]> {
        const data = await this.getAll();
        if (!data.hasOwnProperty(this._cacheKey)) {
            return [];
        }

        return data[this._cacheKey];
    }
    async getTiddlerByTabID(tab_id: string): Promise<ITiddlerDraft> {
        const editors = await this.get(this._cacheKey);
        const editor = editors.filter(
            (editor: ITiddlerDraft) => editor.tab_id === tab_id
        );
        return editor.pop();
    }

    async getTiddlerByDraftID(draft_id: string): Promise<ITiddlerDraft> {
        const editors = await this.get(this._cacheKey);
        const editor = editors.filter(
            (editor: ITiddlerDraft) => editor.draft_id === draft_id
        );
        return editor.pop();
    }
    async reset() {
        await this._setAll(this._storageDefaults);
    }

    async updateTiddler(tab_id: string, tiddler: ITiddlerDraft) {
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

export default new TiddlerDrafts();
