import { browser } from "webextension-polyfill-ts";
import API from "../lib/API";
import ConfigStorage from "../lib/storage/ConfigStorage";
import ContextMenu from "./ContextMenu";
import Messenger from "../lib/Messenger";
import logger from "../lib/logger";
import BackgroundActions from "./BackgroundActions";
class TiddlyBench {
    _api: API;
    _contextMenu: ContextMenu;
    _configStorage: ConfigStorage;
    _messenger: Messenger;
    _backgroundActions: BackgroundActions;

    constructor(
        api: API,
        backgroundActions: BackgroundActions,
        configStorage: ConfigStorage,
        contextMenu: ContextMenu,
        messenger: Messenger
    ) {
        this._api = api;
        this._backgroundActions = backgroundActions;
        this._configStorage = configStorage;
        this._contextMenu = contextMenu;
        this._messenger = messenger;
    }

    async initialize() {
        logger.log("TiddlyBench :: intitialze() called");
        this._messenger.setupListener(
            this._backgroundActions.handleMessengerMessages.bind(
                this._backgroundActions
            )
        );

        await this._contextMenu.initialize();

        // Look for config changes (stored in .storage)
        browser.storage.onChanged.addListener(this.reconfigure.bind(this));
    }

    async reconfigure() {
        console.log("browser.storage changed");
        logger.log("TiddlyBench :: reconfigure called");
        await this._contextMenu.configure();
    }
}

export default TiddlyBench;
