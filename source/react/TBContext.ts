import React from "react";

import ConfigStorage from "../lib/storage/ConfigStorage";
import ContextMenuStorage from "../lib/storage/ContextMenuStorage";
import Messenger from "../lib/Messenger";
import TabsManager from "../lib/TabsManager";
class TBServices {
    public messenger: Messenger;
    public configStorage: ConfigStorage;
    public contextMenuStorage: ContextMenuStorage;
    public tabsManager: TabsManager;

    constructor() {
        this.configStorage = new ConfigStorage();
        this.contextMenuStorage = new ContextMenuStorage(this.configStorage);
        this.messenger = new Messenger();
        this.tabsManager = new TabsManager();
    }
}

const tbServices = new TBServices();
const TBContext = React.createContext<TBServices>(tbServices);

export { TBContext, tbServices };
