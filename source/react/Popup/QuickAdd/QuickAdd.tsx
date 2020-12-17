import React from "react";
import _ from "lodash";
import QuickAddForm from "./QuickAddForm";
import LoadingAnimation from "../../shared/LoadingAnimation";
import {
    EQuickAddDestinations,
    EDispatchAction,
    EDispatchSource,
} from "../../../enums";
import { IDispatchOptions } from "../../../types";
import { TBContext } from "../../TBContext";

const INITIAL_STATE = {
    isProcessingForm: false,
    quickAddText: "",
    selectedDestination: EQuickAddDestinations.JOURNAL,
    selectedBlockType: "",
};
type Props = {};
type State = {
    isProcessingForm: boolean;
    quickAddText: string;
    selectedDestination: EQuickAddDestinations;
    selectedBlockType: string;
};
class QuickAdd extends React.Component<Props, State> {
    static contextType = TBContext;
    constructor(props: Props) {
        super(props);

        this.state = _.cloneDeep(INITIAL_STATE);
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
        this.setState({
            selectedDestination: e.currentTarget.value as EQuickAddDestinations,
        });
    }

    handleChangeSelectedBlockType(e: React.ChangeEvent<HTMLSelectElement>) {
        this.setState({ selectedBlockType: e.currentTarget.value });
    }

    handleChangeText(e: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ quickAddText: e.currentTarget.value });
    }

    handleClickButton() {
        const {
            quickAddText,
            selectedDestination,
            selectedBlockType,
        } = this.state;
        if (quickAddText.trim() === "") {
            // Basic validation
            return;
        }
        // Enable the animation
        this.setState({ isProcessingForm: true });

        const msg: IDispatchOptions = {
            source: EDispatchSource.QUICKADD,
            action: EDispatchAction.ADD_TEXT_TO_TIDDLER,
            destination: selectedDestination,
            packet: {
                text: quickAddText,
                blockType: selectedBlockType,
            },
        };
        console.log(msg);
        this.context.messenger.send(msg);
        this.resetState();
    }

    private resetState() {
        this.setState(_.cloneDeep(INITIAL_STATE));
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
            <div id="tb-popup-quickadd-box">
                <QuickAddForm
                    quickAddText={quickAddText}
                    selectedDestination={selectedDestination}
                    selectedBlockType={selectedBlockType}
                    handleChangeDestination={
                        this.handleChangeSelectedDestination
                    }
                    handleChangeSelectedBlockType={
                        this.handleChangeSelectedBlockType
                    }
                    handleChangeText={this.handleChangeText}
                    handleClickSubmit={this.handleClickButton}
                />
            </div>
        );
    }
}

export default QuickAdd;
