import OptionsSync from "webext-options-sync";
import { ErrValTuple } from "../types";
class Config {
    _sync: any;

    constructor() {
        this._sync = new OptionsSync({
            defaults: {
                url: "",
                username: "",
                password: "",
                context_menu_visibility: "on",
            },
            migrations: [OptionsSync.migrations.removeUnused],
            logging: true,
        });
    }

    async get(key: string): Promise<ErrValTuple> {
        const options = await this.getAll();

        if (options.hasOwnProperty(key)) {
            return [options[key], null];
        }

        return [
            null,
            new Error("That key does not exist in the synced options."),
        ];
    }

    async getAll(): Promise<any> {
        return this._sync.getAll();
    }

    syncForm(formID: string) {
        this._sync.syncForm(formID);
    }
}

export default new Config();
