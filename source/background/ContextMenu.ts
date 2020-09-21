import { browser } from "webextension-polyfill-ts";
import _ from "lodash";
import API from "../lib/API";
import ConfigStorage from "../lib/storage/ConfigStorage";
import Messenger from "../lib/Messenger";

type ContextMenuClickHandler = (
    info: browser.contextMenus.OnClickData,
    tab: browser.tabs.Tab | undefined
) => void;

class ContextMenu {
    _api: API;
    _configStorage: ConfigStorage;
    _messenger: Messenger;
    _handleClickContextMenu: ContextMenuClickHandler;
    isContextMenuEnabled: string = "off";
    doesContextMenuExist: boolean = false;

    constructor(
        api: API,
        configStorage: ConfigStorage,
        messenger: Messenger,
        handleContextMenuClick: ContextMenuClickHandler
    ) {
        this._api = api;
        this._configStorage = configStorage;
        this._messenger = messenger;
        this._handleClickContextMenu = handleContextMenuClick;
    }

    async initialize() {
        await this.configure();
    }

    // Called by config when the config values are changed
    async configure() {
        const shouldBeEnabled = await this._configStorage.get(
            "context_menu_visibility"
        );
        if (shouldBeEnabled !== this.isContextMenuEnabled) {
            this.isContextMenuEnabled = shouldBeEnabled;
        }
        if (this.isContextMenuEnabled === "on") {
            await this.enableContextMenu();
        } else {
            this.disableContextMenu();
        }
    }

    _onContextMenuCreated() {
        // Setup the context menu event listeners
        if (
            !browser.contextMenus.onClicked.hasListener(
                this._handleClickContextMenu
            )
        ) {
        } else {
            console.log("context menu is already created");
        }
    }

    async enableContextMenu() {
        if (!(await this._api.isServerUp())) {
            browser.contextMenus.create(
                {
                    id: "tb-ctxt-configure",
                    title: "Configure TiddlyBench.",
                    contexts: ["all"],
                },
                this._onContextMenuCreated.bind(this)
            );
        } else {
            browser.contextMenus.create(
                {
                    id: "tb-ctxt-add-to-tiddler",
                    title: "Create new Tiddler from selection.",
                    contexts: ["selection"],
                },
                this._onContextMenuCreated.bind(this)
            );
            browser.contextMenus.create(
                {
                    id: "tb-ctxt-add-to-inbox",
                    title: "Add selection to Inbox Tiddler.",
                    contexts: ["selection"],
                },
                this._onContextMenuCreated.bind(this)
            );
        }
        this.doesContextMenuExist = true;
        browser.contextMenus.onClicked.addListener(
            this._handleClickContextMenu
        );
    }

    disableContextMenu() {
        browser.contextMenus.removeAll();
    }
}

export default ContextMenu;
