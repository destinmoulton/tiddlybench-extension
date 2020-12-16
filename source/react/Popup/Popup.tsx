import React from "react";
import Menu from "./Menu";
import QuickAddTiddler from "./QuickAddTiddler/QuickAddTiddler";

const Popup: React.FunctionComponent<{}> = ({}) => {
    return (
        <div>
            <QuickAddTiddler />
            <Menu />
        </div>
    );
};

export default Popup;
