import React from "react";
import Menu from "./Menu";
import QuickAdd from "./QuickAdd/QuickAdd";

const Popup: React.FunctionComponent<{}> = ({}) => {
    return (
        <div>
            <QuickAdd />
            <Menu />
        </div>
    );
};

export default Popup;
