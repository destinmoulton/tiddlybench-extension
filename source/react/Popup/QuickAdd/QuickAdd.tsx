import React from "react";

import QuickAddForm from "./QuickAddForm";
import LoadingAnimation from "../../shared/LoadingAnimation";
type Props = {};
type State = {
    isProcessingForm: boolean;
    quickAddText: string;
    selectedDestination: string;
    selectedBlockType: string;
};
class QuickAdd extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isProcessingForm: false,
            quickAddText: "",
            selectedDestination: "",
            selectedBlockType: "",
        };
        this.handleChangeSelectedBlockType = this.handleChangeSelectedBlockType.bind(
            this
        );
        this.handleChangeSelectedDestination = this.handleChangeSelectedDestination.bind(
            this
        );
        this.handleChangeText = this.handleChangeText.bind(this);
        this.handleClickButton = this.handleClickButton.bind(this);
    }

    handleChangeSelectedDestination(e: React.ChangeEvent<HTMLSelectElement>) {
        this.setState({ selectedDestination: e.currentTarget.value });
    }

    handleChangeSelectedBlockType(e: React.ChangeEvent<HTMLSelectElement>) {
        this.setState({ selectedBlockType: e.currentTarget.value });
    }

    handleChangeText(e: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ quickAddText: e.currentTarget.value });
    }

    handleClickButton(e: React.MouseEvent<HTMLButtonElement>) {
        this.setState({ isProcessingForm: true });
        console.log("clicked button", this.state, e);
    }

    render() {
        const {
            isProcessingForm,
            quickAddText,
            selectedDestination,
            selectedBlockType,
        } = this.state;

        if (isProcessingForm) {
            return <LoadingAnimation loadingText={"Adding tiddler..."} />;
        }
        return (
            <QuickAddForm
                quickAddText={quickAddText}
                selectedDestination={selectedDestination}
                selectedBlockType={selectedBlockType}
                handleChangeDestination={this.handleChangeSelectedDestination}
                handleChangeSelectedBlockType={
                    this.handleChangeSelectedBlockType
                }
                handleChangeText={this.handleChangeText}
                handleClickButton={this.handleClickButton}
            />
        );
    }
}

export default QuickAdd;
