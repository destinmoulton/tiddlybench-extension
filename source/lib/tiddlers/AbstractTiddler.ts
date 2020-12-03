import ConfigStorage from "../storage/ConfigStorage";
import API from "../API";
import recoder from "../formatting/recoder";
import { API_Result, IFullTiddler, ITabInfo } from "../../types";
import ContextMenuStorage from "../storage/ContextMenuStorage";
import { EConfigKey } from "../../enums";

abstract class AbstractTiddler {
    protected api: API;
    protected configStorage: ConfigStorage;
    protected contextMenuStorage: ContextMenuStorage;
    protected tiddlerTitle: string;
    protected tiddler: IFullTiddler;
    abstract async configure(...args: any): Promise<void>;

    constructor(
        api: API,
        configStorage: ConfigStorage,
        contextMenuStorage: ContextMenuStorage
    ) {
        this.api = api;
        this.configStorage = configStorage;
        this.contextMenuStorage = contextMenuStorage;

        this.tiddlerTitle = "";
        this.tiddler = {
            title: "",
            text: "",
            tags: "",
        };
    }

    private async getBlockTypePrefixSuffix(blockType: string) {
        const prefix = await this.configStorage.get(
            "block_" + blockType + "_prefix"
        );
        const suffix = await this.configStorage.get(
            "block_" + blockType + "_suffix"
        );

        return [prefix, suffix];
    }

    public async addText(
        text: string,
        blockType: string,
        tabInfo: ITabInfo | undefined
    ) {
        if (this.getTiddlerTitle() === "") {
            throw new Error(
                "No tiddler title has been set. Make sure the populateTitle and populateTiddler are called."
            );
        }
        const [prefix, suffix] = await this.getBlockTypePrefixSuffix(blockType);

        let newText =
            recoder({ text: prefix, tabInfo }) +
            recoder({ text, tabInfo }) +
            recoder({ text: suffix, tabInfo });

        let tiddlerText = this.getTiddlerText();
        tiddlerText = tiddlerText + newText;
        this.setTiddlerText(tiddlerText);
    }

    async addBookmark(tabInfo: ITabInfo | undefined) {
        if (this.getTiddlerTitle() === "") {
            throw new Error(
                "No tiddler title has been set. Make sure the populateTitle and populateTiddler are called."
            );
        }
        const prefix = await this.configStorage.get(EConfigKey.BOOKMARK_PREFIX);
        const text = await this.configStorage.get(EConfigKey.BOOKMARK_MARKDOWN);
        const suffix = await this.configStorage.get(EConfigKey.BOOKMARK_SUFFIX);

        let newText =
            recoder({ text: prefix, tabInfo }) +
            recoder({ text, tabInfo }) +
            recoder({ text: suffix, tabInfo });

        let tiddlerText = this.getTiddlerText();
        tiddlerText = tiddlerText + newText;
        this.setTiddlerText(tiddlerText);
    }

    /**
     * Check the API for the tiddler.
     * If it doesn't exist, create it
     */
    protected async populateTiddler(): Promise<void> {
        let res: API_Result;
        try {
            res = await this.api.getTiddler(this.tiddlerTitle);
        } catch (err) {
            throw err;
        }
        if (!res.ok && res.status === 404) {
            // The tiddler was not found, so set this one to blank
            this.tiddler.title = this.tiddlerTitle;
        } else if (res.ok) {
            this.tiddler = <IFullTiddler>res.data;
            console.log("_popuplateTiddler :: this._tiddler", this.tiddler);
        } else {
            console.error(res);
            throw new Error(
                `AbstractTiddler :: _populateTiddler() :: API returned unhandled`
            );
        }
    }

    /**
     * Send the Tiddler to the server
     */
    public async submit() {
        if (this.tiddlerTitle === "") {
            throw new Error(
                "AbstractTiddler :: submit() - The _tiddlerTitle has not been set."
            );
        }
        try {
            console.log("submit() :: ", this.tiddler);

            return await this.api.putTiddler(this.tiddler);
        } catch (err) {
            throw err;
        }
    }

    /**
     * Get the tiddler
     */
    public getTiddler(): IFullTiddler {
        return this.tiddler;
    }

    public getTiddlerText(): string {
        return this.tiddler.text;
    }

    public getTiddlerTitle(): string {
        return this.tiddlerTitle;
    }

    public setTiddlerTitle(tiddlerTitle: string) {
        this.tiddlerTitle = recoder({ text: tiddlerTitle });
    }

    public setTiddlerText(text: string) {
        this.tiddler.text = text;
    }

    public setTiddlerTags(tags: string) {
        this.tiddler.tags = tags;
    }

    jsonify() {}
}
export default AbstractTiddler;
