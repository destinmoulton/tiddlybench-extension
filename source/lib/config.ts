import OptionsSync from "webext-options-sync";
import { ErrValTuple } from "../types";
class Config {
    _sync = {};

    constructor() {
        this._sync = new OptionsSync({
            defaults: {
                url: "",
                username: "",
                password: "",
                is_context_menu_enabled: true,
            },
            migrations: [OptionsSync.migrations.removeUnused],
            logging: true,
        });
    }

    async get(key: string): Promise<ErrValTuple> {
        const options = await this._sync.getAll();

        if (options.hasOwnProperty(key)) {
            return [options[key], null];
        }

        return [
            null,
            new Error("That key does not exist in the synced options."),
        ];
    }
}

export default new Config();
