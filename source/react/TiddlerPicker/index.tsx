import React from "react";
import ReactDOM from "react-dom";
import TiddlerPicker from "./TiddlerPicker";

import { TBContext, tbServices } from "../TBContext";

ReactDOM.render(
    <React.StrictMode>
        <TBContext.Provider value={tbServices}>
            <TiddlerPicker />
        </TBContext.Provider>
    </React.StrictMode>,
    document.getElementById("root")
);
