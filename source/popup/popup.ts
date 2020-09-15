import HTMLTemplate from "./HTMLTemplate";
import mainmenu from "./MainMenu";
import API from "../lib/API";
import extensionurls from "../lib/extensionurls";
import Messenger from "../lib/Messenger";
import ConfigStorage from "../lib/storage/ConfigStorage";
import QuickAddTiddler from "./QuickAddTiddler";
window.addEventListener("load", function() {
    const configStorage = new ConfigStorage();
    const api = new API(configStorage);
    const messenger = new Messenger(configStorage);
    const quickAddTiddler = new QuickAddTiddler(messenger);
    const popup = new Popup(api, quickAddTiddler);
    popup.initialize();
});

class Popup extends HTMLTemplate {
    _api: API;
    _quickAddTiddler: QuickAddTiddler;
    constructor(api: API, quickAddTiddler: QuickAddTiddler) {
        super();
        this._api = api;
        this._quickAddTiddler = quickAddTiddler;
    }
    async initialize() {
        this._loadingAnimation("Checking server status...");
        const status = await this._api.getStatus();

        console.log(status);
        if (!status.ok) {
            const html = this._compile("tmpl-not-connected", {});

            this._render(html);

            const $button = document.getElementById(
                "tb-popup-configure-button"
            );

            if ($button) {
                $button.addEventListener(
                    "click",
                    extensionurls.openSettingsTab
                );
            }
        } else {
            mainmenu.show();
            this._quickAddTiddler.display();
        }
    }
}
