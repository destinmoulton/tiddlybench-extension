import React from "react";

type NewBoxProps = {
    tiddlerName: string;
    isVisible: boolean;
    clickHandler: () => void;
};
const AddNewBox: React.FunctionComponent<NewBoxProps> = ({
    tiddlerName,
    isVisible,
    clickHandler,
}) => {
    let visibleClass = isVisible ? "animate-fade-in" : "animate-hidden";

    return (
        <div
            id="tb-tp-add-new-tiddler-box"
            className={visibleClass}
            onClick={clickHandler}
        >
            <div id="tb-tp-tlan-notfound">"{tiddlerName}" was not found.</div>
            <div id="tb-tp-tlan-title">Create a Tiddler</div>
            <div id="tb-tp-tlan-note">
                Click this box, press Enter, or press Return to continue.
            </div>
        </div>
    );
};

export default AddNewBox;
