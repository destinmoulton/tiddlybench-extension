import API from "../lib/API";
import BackgroundActions from "./BackgroundActions";
import ConfigStorage from "../lib/storage/ConfigStorage";
import ContextMenu from "./ContextMenu";
import Messenger from "../lib/Messenger";
import TabsManager from "../lib/TabsManager";
import TiddlyBench from "./TiddlyBench";

(async function() {
    const configStorage = new ConfigStorage();
    const tabsmanager = new TabsManager();
    const api = new API(configStorage);
    const messenger = new Messenger(api, configStorage);
    const backgroundActions = new BackgroundActions(
        api,
        configStorage,
        messenger,
        tabsmanager
    );
    const contextMenu = new ContextMenu(
        api,
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
