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
    const messenger = new Messenger();
    const quickAddTiddler = new QuickAddTiddler(configStorage, messenger);
    const mainMenu = new MainMenu(tabsManager);
    const popup = new Popup(api, mainMenu, quickAddTiddler, tabsManager);
    popup.initialize();
});

class Popup extends PopupTemplate {
    private api: API;
    private mainMenu: MainMenu;
    private quickAddTiddler: QuickAddTiddler;
    private tabsManager: TabsManager;

    constructor(
        api: API,
        mainMenu: MainMenu,
        quickAddTiddler: QuickAddTiddler,
        tabsManager: TabsManager
    ) {
        super();
        this.api = api;
        this.mainMenu = mainMenu;
        this.quickAddTiddler = quickAddTiddler;
        this.tabsManager = tabsManager;
    }
    public async initialize() {
        //const status = await this._api.getStatus();

        if (!(await this.api.isServerUp())) {
            await this.tabsManager.openSettingsTab();
        } else {
            // Add the html
            this.quickAddTiddler.display();
            this.mainMenu.display();

            // setup the functionality
            await this.quickAddTiddler.setup();
            this.mainMenu.setup();
        }
    }
}
