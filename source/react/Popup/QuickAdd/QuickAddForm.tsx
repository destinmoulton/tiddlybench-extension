import React from "react";

import BlockTypeSelector from "./BlockTypeSelector";
import DestinationSelector from "./DestinationSelector";
type Props = {
    quickAddText: string;
    selectedDestination: string;
    selectedBlockType: string;
    handleChangeDestination: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleChangeSelectedBlockType: (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => void;
    handleChangeText: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleClickButton: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const QuickAddForm: React.FunctionComponent<Props> = ({
    quickAddText,
    selectedDestination,
    selectedBlockType,
    handleChangeSelectedBlockType,
    handleChangeDestination,
    handleChangeText,
    handleClickButton,
}) => {
    return (
        <form className="pure-form ">
            <fieldset>
                <legend>
                    <span className="jam jam-plus-rectangle"></span>
                    &nbsp;Quick Add to Tiddler
                </legend>
                <div className="pure-control-group">
                    <textarea
                        autoFocus
                        id="tb-popup-quickadd-contents"
                        value={quickAddText}
                        onChange={handleChangeText}
                    ></textarea>
                </div>
                <div className="pure-control-group tb-popup-quickadd-destination-container">
                    <DestinationSelector
                        handleChange={handleChangeDestination}
                        selectedDestination={selectedDestination}
                    />
                    <BlockTypeSelector
                        handleChange={handleChangeSelectedBlockType}
                        selectedBlockType={selectedBlockType}
                    />
                </div>
                <div className="pure-control-group tb-popup-quickadd-button-container">
                    <button
                        type="button"
                        id="tb-popup-quickadd-submit-button"
                        className="tb-btn tb-btn-primary"
                        onClick={handleClickButton}
                    >
                        Add Text
                    </button>
                </div>
            </fieldset>
        </form>
    );
};

export default QuickAddForm;
