import API from "../lib/API";
import BackgroundActions from "./BackgroundActions";
import ConfigStorage from "../lib/storage/ConfigStorage";
import ContextMenu from "./ContextMenu";
import Messenger from "../lib/Messenger";
import TiddlyBench from "./TiddlyBench";

(async function() {
    const configStorage = new ConfigStorage();
    const api = new API(configStorage);
    const messenger = new Messenger(api, configStorage);
    const backgroundActions = new BackgroundActions(
        api,
        configStorage,
        messenger
    );
    const contextMenu = new ContextMenu(
        configStorage,
        messenger,
        backgroundActions.handleContextMenuClicks.bind(backgroundActions)
    );
    const tiddlyBench = new TiddlyBench(
        api,
        backgroundActions,
        configStorage,
        contextMenu,
        messenger
    );
    await tiddlyBench.initialize();
})();
