import PopupTemplate from "./PopupTemplate";
import TabsManager from "../lib/TabsManager";
class MainMenu extends PopupTemplate {
    _tabsManager: TabsManager;
    constructor(tabsManager: TabsManager) {
        super();
        this._tabsManager = tabsManager;
    }
    display() {
        const html = this._compile("tmpl-main-menu", {});

        this._append(html);

        const $link = document.getElementById("tb-link-configure");
        if ($link) {
            $link.addEventListener(
                "click",
                this._tabsManager.openSettingsTab.bind(this._tabsManager)
            );
        }
    }
}

export default MainMenu;
