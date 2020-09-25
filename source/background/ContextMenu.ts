import { browser } from "webextension-polyfill-ts";
import _ from "lodash";
import API from "../lib/API";
import ConfigStorage from "../lib/storage/ConfigStorage";
import ContextMenuStorage from "../lib/storage/ContextMenuStorage";
import Messenger from "../lib/Messenger";
import { EContextMenuBlockType } from "../enums";

type ContextMenuClickHandler = (
    info: browser.contextMenus.OnClickData,
    tab: browser.tabs.Tab | undefined
) => void;

// interface IBlockTypes {
//     [key: EContextMenuBlockType]: string;
// }

const BLOCK_TYPES = {
    [EContextMenuBlockType.QUOTE]: "Quotation Block",
    [EContextMenuBlockType.CODE]: "Code Block",
    [EContextMenuBlockType.PARAGRAPH]: "Paragraph",
    [EContextMenuBlockType.ULITEM]: "Unordered List Item",
    [EContextMenuBlockType.OLITEM]: "Ordered List Item",
};

class ContextMenu {
    _api: API;
    _configStorage: ConfigStorage;
    _contextMenuStorage: ContextMenuStorage;
    _messenger: Messenger;
    _handleClickContextMenu: ContextMenuClickHandler;
    doesContextMenuExist: boolean = false;

    constructor(
        api: API,
        configStorage: ConfigStorage,
        contextMenuStorage: ContextMenuStorage,
        messenger: Messenger,
        handleContextMenuClick: ContextMenuClickHandler
    ) {
        this._api = api;
        this._configStorage = configStorage;
        this._contextMenuStorage = contextMenuStorage;
        this._messenger = messenger;
        this._handleClickContextMenu = handleContextMenuClick;
    }

    async initialize() {
        await this.configure();
    }

    // Called by config when the config values are changed
    async configure() {
        await this.setupContextMenu();
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

    async setupContextMenu() {
        if (!(await this._api.isServerUp())) {
            browser.contextMenus.removeAll();
            browser.contextMenus.create({
                id: "tb-ctxt-configure",
                title: "Configure TiddlyBench.",
                contexts: ["all"],
            });
        } else {
            const selectedBlockType = await this._contextMenuStorage.getSelectedBlockType();
            const destinationTiddlers = await this._contextMenuStorage.getAllCustomDestinations();
            browser.contextMenus.removeAll();

            // Setup the block types radio options
            for (let type in BLOCK_TYPES) {
                const checked = type === selectedBlockType;
                browser.contextMenus.create({
                    id: "tb-ctxt-change-blocktype|" + type,
                    title: BLOCK_TYPES[<EContextMenuBlockType>type],
                    type: "radio",
                    checked,
                    contexts: ["selection"],
                });
            }
            browser.contextMenus.create({
                id: "tb-top-separator",
                type: "separator",
                contexts: ["selection"],
            });
            browser.contextMenus.create({
                id: "tb-ctxt-add-to-inbox",
                title: "Add selection to Inbox Tiddler >>",
                contexts: ["selection"],
            });
            browser.contextMenus.create({
                id: "tb-ctxt-add-to-journal",
                title: "Add selection to Journal Tiddler >>",
                contexts: ["selection"],
            });
            browser.contextMenus.create({
                id: "tb-ctxt-choose-tiddler",
                title: "Add selection to... Choose Tiddler",
                contexts: ["selection"],
            });

            if (destinationTiddlers.length > 0) {
                browser.contextMenus.create({
                    id: "tb-tiddler-destination-prefix-separator",
                    type: "separator",
                    contexts: ["selection"],
                });
                for (let dest of destinationTiddlers) {
                    browser.contextMenus.create({
                        id: "tb-ctxt-add-to-destination|" + dest.tiddler.tb_id,
                        title:
                            "Add selection to '" +
                            dest.tiddler.title.substring(0, 20) +
                            "...'",
                        contexts: ["selection"],
                    });
                }
            }
        }
        this.doesContextMenuExist = true;
        browser.contextMenus.onClicked.addListener(
            this._handleClickContextMenu
        );
    }
}

export default ContextMenu;
