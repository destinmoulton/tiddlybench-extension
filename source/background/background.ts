import API from "../lib/API";
import BackgroundActions from "./BackgroundActions";
import ConfigStorage from "../lib/storage/ConfigStorage";
import ContextMenu from "./ContextMenu";
import ContextMenuStorage from "../lib/storage/ContextMenuStorage";
import Messenger from "../lib/Messenger";
import TabsManager from "../lib/TabsManager";
import TiddlyBench from "./TiddlyBench";
import TiddlerDispatcher from "../lib/tiddlers/TiddlerDispatcher";

(async function() {
    const configStorage = new ConfigStorage();
    const contextMenuStorage = new ContextMenuStorage(configStorage);
    const tabsmanager = new TabsManager();
    const api = new API(configStorage);
    const messenger = new Messenger();
    const tiddlerDispatcher = new TiddlerDispatcher(
        api,
        configStorage,
        contextMenuStorage
    );
    const backgroundActions = new BackgroundActions(
        api,
        configStorage,
        contextMenuStorage,
        messenger,
        tabsmanager,
        tiddlerDispatcher
    );
    const contextMenu = new ContextMenu(
        api,
        configStorage,
        contextMenuStorage,
        messenger,
        backgroundActions.handleContextMenuClicks.bind(backgroundActions)
    );
    const tiddlyBench = new TiddlyBench(
        api,
        backgroundActions,
        configStorage,
        contextMenu,
        contextMenuStorage,
        messenger
    );
    await tiddlyBench.initialize();
})();
