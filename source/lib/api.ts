import config from "./storage/config";
import base64 from "base-64";

//import logger from "../lib/logger";
import { API_Result, ITiddlerItem, IFullTiddler } from "../types";
export const ENDPOINTS = {
    BASE: "/",
    GET_ALL: "/recipes/default/tiddlers.json",
    STATUS: "/status",
    PUT_TIDDLER: "/recipes/default/tiddlers/",
};

class API {
    constructor() {
        this.joinURL = this.joinURL.bind(this);
    }

    joinURL(p1: string, p2: string) {
        p1 = p1.endsWith("/") ? p1.substr(0, p1.length - 1) : p1;
        p2 = p2.startsWith("/") ? p2.substr(1) : p2;

        return p1 + "/" + p2;
    }

    async _getAuthorizationHeaders(): Promise<Headers> {
        const options = await config.getAll();

        return new Headers({
            Authorization: `Basic ${base64.encode(
                `${options.username}:${options.password}`
            )}`,
        });
    }

    async get(url: string): Promise<API_Result> {
        let response;
        const headers = await this._getAuthorizationHeaders();
        try {
            response = await fetch(url, { headers });
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

        if (response.status === 404) {
            return {
                ok: false,
                message:
                    "Unable to find that URL. Make sure you include http:// or https://.",
                response,
            };
        }

        if (response.status === 401) {
            return {
                ok: false,
                message: "The username or password is invalid.",
                response,
            };
        }
        const data: ITiddlerItem[] = await response.json();

        return { ok: true, data };
    }

    async putTiddler(tiddler: IFullTiddler): Promise<API_Result> {
        if (!tiddler.title || tiddler.title === "") {
            throw new Error(
                "API :: putTiddler() :: You must include a title in the tiddler."
            );
        }
        let response;
        const headers = await this._getAuthorizationHeaders();
        const options = {
            method: "PUT",
            headers,
        };
        const uriTitle = encodeURIComponent(tiddler.title);
        const url = ENDPOINTS.PUT_TIDDLER + uriTitle;
        try {
            response = await fetch(url, options);
            console.log("API :: putTiddler() :: ", response);
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

        if (response.status === 404) {
            return {
                ok: false,
                message:
                    "Unable to find that URL. Make sure you include http:// or https://.",
                response,
            };
        }

        if (response.status === 401) {
            return {
                ok: false,
                message: "The username or password is invalid.",
                response,
            };
        }

        return { ok: true };
    }
    /**
     * Get the /status of the server
     */
    async getStatus(): Promise<API_Result> {
        const options = await config.getAll();
        const url = this.joinURL(options.url, ENDPOINTS.STATUS);
        return await this.get(url);
    }
}

export default new API();
