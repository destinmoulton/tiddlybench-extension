import { browser } from "webextension-polyfill-ts";
import _ from "lodash";
import API from "../lib/API";
import ConfigStorage from "../lib/storage/ConfigStorage";
import ContextMenuStorage from "../lib/storage/ContextMenuStorage";
import Messenger from "../lib/Messenger";
import { BLOCK_TYPES, CONTEXT_TYPE_TITLES } from "../constants";
import {
    EBlockType,
    EContextType,
    EDestinationTiddler,
    EDispatchAction,
} from "../enums";
import { ICustomDestination } from "../types";

type ContextMenuClickHandler = (
    info: browser.contextMenus.OnClickData,
    tab: browser.tabs.Tab | undefined
) => void;

// interface IBlockTypes {
//     [key: EBlockType]: string;
// }

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
                title: "Configure TiddlyBench",
                contexts: ["all"],
            });
        } else {
            browser.contextMenus.removeAll();
            const destinationTiddlers = <ICustomDestination[]>(
                await this._contextMenuStorage.getAllCustomDestinations()
            );
            await this._setupSelectionContext(destinationTiddlers);
            this._setupAddContext(EContextType.PAGE, EDispatchAction.ADD_BOOKMARK_TO_TIDDLER, destinationTiddlers);
            //this._setupAddContext(EContextType.TAB, destinationTiddlers);
        }
        this.doesContextMenuExist = true;
        browser.contextMenus.onClicked.addListener(
            this._handleClickContextMenu
        );
    }

    /**
     */
    async _setupSelectionContext(destinationTiddlers: ICustomDestination[]) {
        const selectedBlockType = await this._contextMenuStorage.getSelectedBlockType();

        // Setup the block types radio options
        for (let type in BLOCK_TYPES) {
            const checked = type === selectedBlockType;
            browser.contextMenus.create({
                id: `tb-ctxt-action|context=${EContextType.SELECTION}&action=${EDispatchAction.CHANGE_BLOCKTYPE}&blocktype=${type}`,
                title: BLOCK_TYPES[<EBlockType>type],
                type: "radio",
                checked,
                contexts: ["selection"],
            });
        }
        browser.contextMenus.create({
            id: "tb-ctxt-selection-top-separator",
            type: "separator",
            contexts: ["selection"],
        });

        this._setupAddContext(EContextType.SELECTION, EDispatchAction.ADD_TEXT_TO_TIDDLER, destinationTiddlers);
    }

    /**
     * The context menu options that appear when
     * right clicking over a context (link, page, tab, selection, etc...)
     *
     * @param destinationTiddlers
     */
    _setupAddContext(
        context: EContextType,
        action: EDispatchAction,
        destinationTiddlers: ICustomDestination[]
    ) {
        const title = CONTEXT_TYPE_TITLES[context];
        browser.contextMenus.create({
            id: `tb-ctxt-action|context=${context}&action=${action}&destination=${EDestinationTiddler.INBOX}`,
            title: `Add ${title} to Inbox Tiddler`,
            contexts: [context],
        });
        browser.contextMenus.create({
            id: `tb-ctxt-action|context=${context}&action=${action}&destination=${EDestinationTiddler.JOURNAL}`,
            title: `Add ${title} to Journal Tiddler`,
            contexts: [context],
        });
        browser.contextMenus.create({
            id: `tb-ctxt-${context}-separator-pre`,
            type: "separator",
            contexts: [context],
        });
        browser.contextMenus.create({
            id: `tb-ctxt-action|context=${context}&action=${EDispatchAction.CHOOSE_CUSTOM_DESTINATION}`,
            title: `Add ${title} to Other Tiddler`,
            contexts: [context],
        });
        if (destinationTiddlers.length > 0) {
            browser.contextMenus.create({
                id: `tb-ctxt-${context}-separator-post`,
                type: "separator",
                contexts: [context],
            });
            for (let dest of destinationTiddlers) {
                browser.contextMenus.create({
                    id:
                        `tb-ctxt-action|context=${context}&action=${action}&destination=${EDestinationTiddler.CUSTOM}&tiddler_id=` +
                        dest.tiddler.tb_id,
                    title:
                        `Add ${title} to '` +
                        dest.tiddler.title.substring(0, 20) +
                        "...'",
                    contexts: [context],
                });
            }
        }
    }
}

export default ContextMenu;
