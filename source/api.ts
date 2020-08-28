import messenger from "./messenger";

import optionsStorage from "./options-storage";
import base64 from "base-64";

class API {
    async test() {
        var options = await optionsStorage.getAll();
        messenger.log(options);
        const headers = new Headers({
            Authorization: `Basic ${base64.encode(
                `${options.username}:${options.password}`
            )}`,
        });
        return fetch(options.url, { headers }).then((response) => {
            if (!response.ok) throw new Error(response.status.toString());
            messenger.log("test :: ", response);
            return response.json();
        });
    }
}

export default new API();
