import OptionsSync from "webext-options-sync";

export default new OptionsSync({
    defaults: {
        url: "",
        username: "",
        password: "",
    },
    migrations: [OptionsSync.migrations.removeUnused],
    logging: true,
});
