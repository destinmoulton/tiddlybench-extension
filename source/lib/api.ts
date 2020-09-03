import optionsStorage from "./storage/config";
import base64 from "base-64";

//import logger from "../lib/logger";
import { API_Result, Tiddler } from "../types";
export const ENDPOINTS = {
    BASE: "/",
    GET_ALL: "/recipes/default/tiddlers.json",
    STATUS: "/status",
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

    async get(url: string): Promise<API_Result> {
        const options = await optionsStorage.getAll();

        const headers = new Headers({
            Authorization: `Basic ${base64.encode(
                `${options.username}:${options.password}`
            )}`,
        });

        let response;
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
        const data: Tiddler[] = await response.json();

        return { ok: true, data };
    }
}

export default new API();
