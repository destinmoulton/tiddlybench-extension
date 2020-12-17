import React from "react";
import ReactDOM from "react-dom";
import Popup from "./Popup";

import { TBContext, tbServices } from "../TBContext";

ReactDOM.render(
    <React.StrictMode>
        <TBContext.Provider value={tbServices}>
            <Popup />
        </TBContext.Provider>
    </React.StrictMode>,
    document.getElementById("tb-popup-root")
);
