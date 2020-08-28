import messenger from "./messenger";

import optionsStorage from "./options-storage";
import base64 from "base-64";

const ENDPOINTS = {
    BASE: "/",
    GET_ALL: "/recipes/default/tiddlers.json",
};

class API {
    joinURL(p1: string, p2: string) {
        messenger.log("joining url");
        p1 = p1.endsWith("/") ? p1.substr(0, p1.length - 1) : p1;
        p2 = p2.startsWith("/") ? p2.substr(1) : p2;

        return p1 + "/" + p2;
    }

    async test() {
        messenger.log("running api test");
        var options = await optionsStorage.getAll();
        messenger.log(options);
        var url = this.joinURL(options.url, ENDPOINTS.GET_ALL);
        messenger.log(url);

        const headers = new Headers({
            Authorization: `Basic ${base64.encode(
                `${options.username}:${options.password}`
            )}`,
        });

        return fetch(url, { headers }).then((response) => {
            messenger.log(response.status);
            if (!response.ok) throw new Error(response.status.toString());
            messenger.log("test :: ", response.json());
            return response.json();
        });
    }
}

export default new API();
