import { API_Result, IFullTiddler } from "../../types";
import ConfigStorage from "../storage/ConfigStorage";
import API from "../API";
abstract class AbstractTiddler {
    protected _configStorage: ConfigStorage;
    protected _api: API;
    protected _tiddlerTitle: string;
    protected _tiddler: IFullTiddler;
    protected abstract _populateTitle(): void;
    protected abstract addText(
        text: string,
        tab: browser.tabs.Tab | undefined
    ): void;

    constructor(configStorage: ConfigStorage, api: API) {
        this._configStorage = configStorage;
        this._api = api;

        this._tiddlerTitle = "";
        this._tiddler = {
            title: "",
            text: "",
        };
    }

    async initialize() {
        await this._populateTitle();
        await this._populateTiddler();
    }

    /**
     * Check the API for the tiddler.
     * If it doesn't exist, crea
     */
    protected async _populateTiddler(): Promise<void> {
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

    setTiddlerText(text: string) {
        this._tiddler.text = text;
    }

    jsonify() {}
}
export default AbstractTiddler;
