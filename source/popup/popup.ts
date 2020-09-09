import HTMLTemplate from "./HTMLTemplate";
import mainmenu from "./MainMenu";
import quickAddTiddler from "./QuickAddTiddler";
import api from "../lib/api";
import extensionurls from "../lib/extensionurls";

window.addEventListener("load", function() {
    const popup = new Popup();
    popup.initialize();
});

class Popup extends HTMLTemplate {
    async initialize() {
        this._loadingAnimation("Checking server status...");
        const status = await api.getStatus();

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
            quickAddTiddler.display();
        }
    }
}
