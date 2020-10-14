import ConfigStorage from "../storage/ConfigStorage";
import API from "../API";
import recoder from "../formatting/recoder";
import { API_Result, IFullTiddler, ITabInfo } from "../../types";
import ContextMenuStorage from "../storage/ContextMenuStorage";

abstract class AbstractTiddler {
    protected _api: API;
    protected _configStorage: ConfigStorage;
    protected _contextMenuStorage: ContextMenuStorage;
    protected _tiddlerTitle: string;
    protected _tiddler: IFullTiddler;
    abstract async populateTitle(...args: any): Promise<void>;

    constructor(
        api: API,
        configStorage: ConfigStorage,
        contextMenuStorage: ContextMenuStorage
    ) {
        this._api = api;
        this._configStorage = configStorage;
        this._contextMenuStorage = contextMenuStorage;

        this._tiddlerTitle = "";
        this._tiddler = {
            title: "",
            text: "",
        };
    }

    async getBlockTypePrefixSuffix(blockType: string) {
        const prefix = await this._configStorage.get(
            "block_" + blockType + "_prefix"
        );
        const suffix = await this._configStorage.get(
            "block_" + blockType + "_suffix"
        );

        return [prefix, suffix];
    }

    async addText(
        text: string,
        blockType: string,
        tabInfo: ITabInfo | undefined
    ) {
        const [prefix, suffix] = await this.getBlockTypePrefixSuffix(blockType);

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
     * If it doesn't exist, crea
     */
    protected async populateTiddler(): Promise<void> {
        let res: API_Result;
        try {
            res = await this._api.getTiddler(this._tiddlerTitle);
        } catch (err) {
            throw err;
        }
        if (!res.ok && res.status === 404) {
            // The tiddler was not found, so set this one to blank
            this._tiddler.title = this._tiddlerTitle;
        } else if (res.ok) {
            this._tiddler = <IFullTiddler>res.data;
            console.log("_popuplateTiddler :: this._tiddler", this._tiddler);
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
    async submit() {
        try {
            return await this._api.putTiddler(this._tiddler);
        } catch (err) {
            throw err;
        }
    }

    /**
     * Get the tiddler
     */
    getTiddler(): IFullTiddler {
        return this._tiddler;
    }

    getTiddlerText(): string {
        return this._tiddler.text;
    }

    getTiddlerTitle(): string {
        return this._tiddlerTitle;
    }

    setTiddlerText(text: string) {
        this._tiddler.text = text;
    }

    jsonify() {}
}
export default AbstractTiddler;
