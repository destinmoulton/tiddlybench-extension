import React, { useCallback } from "react";
import TabsManager from "../../lib/TabsManager";

const Menu: React.FunctionComponent<{}> = ({}) => {
    const handleClickConfigure = useCallback(() => {
        const tabsManager = new TabsManager();
        return tabsManager.openSettingsTab();
    }, []);
    return (
        <ul className="tb-popup-main-menu">
            <li id="tb-link-configure" onClick={handleClickConfigure}>
                <span className="jam jam-settings-alt"></span>&nbsp;
                <span className="menu-item-text">Configure TiddlyBench</span>
            </li>
        </ul>
    );
};

export default Menu;
