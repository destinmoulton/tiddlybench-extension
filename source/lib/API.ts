import base64 from "base-64";
import superagent from "superagent";

import ConfigStorage from "./storage/ConfigStorage";
import { openSettingsTab } from "../lib/extensionurls";
import { API_Result, ITiddlerItem, IFullTiddler } from "../types";
export const ENDPOINTS = {
    BASE: "/",
    GET_ALL: "/recipes/default/tiddlers.json",
    STATUS: "/status",
    PUT_TIDDLER: "/recipes/default/tiddlers/",
    GET_SINGLE_TIDDLER: "/recipes/default/tiddlers/",
};

class API {
    _configStorage: ConfigStorage;

    constructor(configStorage: ConfigStorage) {
        this._configStorage = configStorage;
        this.joinURL = this.joinURL.bind(this);
    }

    joinURL(p1: string, p2: string) {
        p1 = p1.endsWith("/") ? p1.substr(0, p1.length - 1) : p1;
        p2 = p2.startsWith("/") ? p2.substr(1) : p2;

        return p1 + "/" + p2;
    }

    async _getAuthorizationHeaders(): Promise<Headers> {
        const options = await this._configStorage.getAll();

        return new Headers({
            Authorization: `Basic ${base64.encode(
                `${options.username}:${options.password}`
            )}`,
        });
    }

    async get(url: string): Promise<API_Result> {
        let response;
        const options = await this._configStorage.getAll();
        //const headers = await this._getAuthorizationHeaders();
        try {
            response = await superagent
                .get(url)
                .auth(options.username, options.password)
                .set("Accept", "application/json")
                .type("json");
            console.log("API :: get() :: response", response);
        } catch (err) {
            if (err.status === 401) {
                return {
                    ok: false,
                    status: err.status,
                    message: "The Username or Password is not valid.",
                };
            }
            return {
                ok: false,
                status: err.status,
                message:
                    "Failed to connect. Check the settings. Make sure you include http:// or https:// in the URL.",
            };
        }

        if (!response.ok) {
            return {
                ok: false,
                message:
                    "Failed to connect to that server. Check the URL. Make sure you include http:// or https://.",
                response,
            };
        }

        const data: ITiddlerItem[] = await response.body;

        return { ok: true, data };
    }

    async putTiddler(tiddler: IFullTiddler): Promise<API_Result> {
        if (!tiddler.title || tiddler.title === "") {
            throw new Error(
                "API :: putTiddler() :: You must include a title in the tiddler."
            );
        }
        const conf = await this._configStorage.getAll();
        let response;
        //const headers = await this._getAuthorizationHeaders();
        const uriTitle = encodeURIComponent(tiddler.title);
        let url = this.joinURL(conf.url, ENDPOINTS.PUT_TIDDLER);
        url = this.joinURL(url, uriTitle);
        try {
            response = await superagent
                .put(url)
                .send(tiddler)
                .auth(conf.username, conf.password)
                .type("json")
                .set("Accept", "application/json")
                .set("X-Requested-With", "TiddlyWiki");
        } catch (err) {
            return {
                ok: false,
                message:
                    "Failed to connect. Check the URL. Make sure you include http:// or https://.",
            };
        }

        if (!response.ok) {
            return {
                ok: false,
                message:
                    "Failed to connect to that server. Check the URL. Make sure you include http:// or https://.",
                response,
            };
        }

        return { ok: true };
    }
    /**
     * Get the /status of the server
     */
    async getStatus(): Promise<API_Result> {
        const options = await this._configStorage.getAll();
        const url = this.joinURL(options.url, ENDPOINTS.STATUS);
        return await this.get(url);
    }

    async getTiddler(tiddlerTitle: string): Promise<API_Result> {
        const serverURL = await this._configStorage.get("url");
        const uriTiddlerTitle = encodeURIComponent(tiddlerTitle);
        let url = this.joinURL(serverURL, ENDPOINTS.GET_SINGLE_TIDDLER);
        url = this.joinURL(url, uriTiddlerTitle);

        return await this.get(url);
    }

    async getAllTiddlers(): Promise<ITiddlerItem[]> {
        const serverURL = await this._configStorage.get("url");
        let url = this.joinURL(serverURL, ENDPOINTS.GET_ALL);

        const res = await this.get(url);
        if (res.data && res.data.length > 0) {
            return <ITiddlerItem[]>res.data;
        }
        return [];
    }
    /**
     * Check if the server is up.
     *
     * If the server is not up, open the config tab.
     */
    async isServerUp(): Promise<boolean> {
        const status = await this.getStatus();
        if (status.ok) {
            return true;
        }

        await openSettingsTab();
        return false;
    }
}

export default API;
