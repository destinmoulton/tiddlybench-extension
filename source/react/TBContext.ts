import React from "react";

import Messenger from "../lib/Messenger";
class TBServices {
    public messenger: Messenger;

    constructor() {
        this.messenger = new Messenger();
    }
}

const tbServices = new TBServices();
const TBContext = React.createContext<TBServices>(tbServices);

export { TBContext, tbServices };
