import { API_Result, IFullTiddler } from "../../types";
import api from "../api";
abstract class AbstractTiddler {
    protected _tiddlerTitle: string;
    protected _tiddlerText: string;
    protected _tiddler: IFullTiddler;
    protected abstract _populateTitle(): void;

    constructor() {
        this._tiddlerTitle = "";
        this._tiddlerText = "";
        this._tiddler = {
            title: "",
            text: "",
        };
    }

    protected async initialize() {
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
            res = await api.getTiddler(this._tiddlerTitle);
        } catch (err) {
            throw err;
        }
        if (res.status === 404) {
            // The tiddler was not found, so set this one to blank
            this._tiddler.title = this._tiddlerTitle;
        } else if (res.status === 200) {
            this._tiddler = <IFullTiddler>res.data;
        } else {
            throw new Error(
                `AbstractTiddler :: _populateCurrent() :: API returned unhandled status ${res.status}`
            );
        }
    }

    /**
     * Send the Tiddler to the server
     */
    submit() {}
    getTiddler(): IFullTiddler {
        return this._tiddler;
    }

    jsonify() {}
}
export default AbstractTiddler;
