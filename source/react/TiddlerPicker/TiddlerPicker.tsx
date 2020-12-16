import React from "react";

import AddNewBox from "./AddNewBox";
import TiddlerForm from "./TiddlerForm";
import TiddlerList from "./TiddlerList";

type PickerState = {
    isAddNewBoxVisible: boolean;
    isFullFormVisible: boolean;
    isListEmpty: boolean;

    filterText: string;
};
class TiddlerPicker extends React.Component<{}, PickerState> {
    constructor(props: any) {
        super(props);
        this.state = {
            isAddNewBoxVisible: false,
            isFullFormVisible: false,
            isListEmpty: true,
            filterText: "",
        };

        this.handleChangeFilter = this.handleChangeFilter.bind(this);
        this.handleClickAddNewBox = this.handleClickAddNewBox.bind(this);
        this.setNumberVisible = this.setNumberVisible.bind(this);
    }
    handleChangeFilter(newFilterText: string) {
        console.log("handleChangeFilter called");
        this.setState({ filterText: newFilterText });
    }

    handleClickAddNewBox() {
        this.setState({ isFullFormVisible: true, isAddNewBoxVisible: false });
    }

    // Determine whether to show the "Add New Tiddler" box
    setNumberVisible(numVisible: number) {
        const { isAddNewBoxVisible, isFullFormVisible } = this.state;
        if (numVisible === 0) {
            this.setState({ isListEmpty: true });
            if (!isAddNewBoxVisible && !isFullFormVisible) {
                this.setState({ isAddNewBoxVisible: true });
            }
        } else if (numVisible > 0) {
            this.setState({ isListEmpty: false });
            if (isAddNewBoxVisible) {
                this.setState({ isAddNewBoxVisible: false });
            }
        }
    }
    render() {
        const {
            filterText,
            isAddNewBoxVisible,
            isListEmpty,
            isFullFormVisible,
        } = this.state;

        return (
            <div className="tb-tp-content">
                <div className="tb-tp-title-container">
                    <div className="tb-tp-title">TiddlyBench</div>
                    <h3>Find or Add a Tiddler</h3>
                </div>
                <TiddlerForm
                    isFullFormVisible={isFullFormVisible}
                    isButtonEnabled={isListEmpty}
                    handleChangeFilter={this.handleChangeFilter}
                />
                <TiddlerList
                    filterText={filterText}
                    updateNumberVisible={this.setNumberVisible}
                />
                <AddNewBox
                    tiddlerName={filterText}
                    isVisible={isAddNewBoxVisible}
                    clickHandler={this.handleClickAddNewBox}
                />
            </div>
        );
    }
}

export default TiddlerPicker;
