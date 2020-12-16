import React from "react";

type QAState = {
    quickAddText: string;
    selectedDestination: string;
    selectedBlockType: string;
};
class QuickAddTiddler extends React.Component<{}, QAState> {
    constructor() {
        super({});

        this.state = {
            quickAddText: "",
            selectedDestination: "",
            selectedBlockType: "",
        };
    }

    render() {
        return (
            <form className="pure-form ">
                <fieldset>
                    <legend>
                        <span className="jam jam-plus-rectangle"></span>
                        &nbsp;Quick Add to Tiddler
                    </legend>
                    <div className="pure-control-group"></div>
                    <div className="pure-control-group">
                        <textarea id="tb-popup-quickadd-contents"></textarea>
                    </div>
                    <div className="pure-control-group tb-popup-quickadd-destination-container">
                        <label htmlFor="tb-popup-quickadd-type">
                            Quick Add to
                        </label>
                        <select id="tb-popup-quickadd-type">
                            <option value="journal">Journal</option>
                            <option value="inbox">Inbox</option>
                        </select>
                        <label htmlFor="tb-popup-quickadd-blocktype">As</label>
                        <select id="tb-popup-quickadd-blocktype"></select>
                    </div>
                    <div className="pure-control-group tb-popup-quickadd-button-container">
                        <button
                            type="button"
                            id="tb-popup-quickadd-submit-button"
                            className="tb-btn tb-btn-primary"
                        >
                            Add Text
                        </button>
                    </div>
                </fieldset>
            </form>
        );
    }
}
