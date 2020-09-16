import API from "../lib/API";
import ConfigStorage from "../lib/storage/ConfigStorage";
import ContextMenu from "./ContextMenu";
import Messenger from "../lib/Messenger";
import TiddlyBench from "./TiddlyBench";

(async function() {
    const configStorage = new ConfigStorage();
    const api = new API(configStorage);
    const contextMenu = new ContextMenu(configStorage);
    const messenger = new Messenger(api, configStorage);
    const tiddlyBench = new TiddlyBench(
        api,
        configStorage,
        contextMenu,
        messenger
    );
    await tiddlyBench.initialize();
})();
