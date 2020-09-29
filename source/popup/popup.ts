import PopupTemplate from "./PopupTemplate";
import MainMenu from "./MainMenu";
import API from "../lib/API";
import ConfigStorage from "../lib/storage/ConfigStorage";
import Messenger from "../lib/Messenger";
import QuickAddTiddler from "./QuickAddTiddler";
import TabsManager from "../lib/TabsManager";
window.addEventListener("load", function() {
    const configStorage = new ConfigStorage();
    const tabsManager = new TabsManager();
    const api = new API(configStorage);
    const messenger = new Messenger(api, configStorage);
    const quickAddTiddler = new QuickAddTiddler(messenger);
    const mainMenu = new MainMenu(tabsManager);
    const popup = new Popup(api, mainMenu, quickAddTiddler, tabsManager);
    popup.initialize();
});

class Popup extends PopupTemplate {
    _api: API;
    _mainMenu: MainMenu;
    _quickAddTiddler: QuickAddTiddler;
    _tabsManager: TabsManager;

    constructor(
        api: API,
        mainMenu: MainMenu,
        quickAddTiddler: QuickAddTiddler,
        tabsManager: TabsManager
    ) {
        super();
        this._api = api;
        this._mainMenu = mainMenu;
        this._quickAddTiddler = quickAddTiddler;
        this._tabsManager = tabsManager;
    }
    async initialize() {
        //const status = await this._api.getStatus();

        if (!(await this._api.isServerUp())) {
            await this._tabsManager.openSettingsTab();
        } else {
            // Add the html
            this._quickAddTiddler.display();
            this._mainMenu.display();

            // setup the functionality
            this._quickAddTiddler.setup();
            this._mainMenu.setup();
        }
    }
}
