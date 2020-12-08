import React from "react";
import _ from "lodash";
type FormState = {
    tiddlerTitle: string;
    tags: string;
};
type FormProps = {
    isFullFormVisible: boolean;
    handleChangeFilter: (newFilterText: string) => void;
};

class TiddlerForm extends React.Component<FormProps, FormState> {
    filterInput: React.RefObject<HTMLInputElement>;
    constructor(props: FormProps) {
        super(props);

        this.state = {
            tiddlerTitle: "",
            tags: "",
        };
        this.handleChangeTiddlerTitle = this.handleChangeTiddlerTitle.bind(
            this
        );
        this.filterInput = React.createRef();
    }
    componentDidMount() {
        if (this.filterInput && this.filterInput.current) {
            this.filterInput.current.focus();
        }
    }

    private handleChangeTiddlerTitle(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ tiddlerTitle: e.target.value });

        this.props.handleChangeFilter(e.target.value);
    }

    private buildFilterBox() {
        return (
            <div>
                <input
                    type="text"
                    id="tb-tp-filter-input"
                    placeholder="Start typing the name of the tiddler..."
                    value={this.state.tiddlerTitle}
                    onChange={this.handleChangeTiddlerTitle}
                    ref={this.filterInput}
                />
            </div>
        );
    }

    private buildLowerForm() {
        let formClass = this.props.isFullFormVisible
            ? "animate-fade-in"
            : "animate-hidden";
        return (
            <div id="tb-tabs-list-formend-container" className={formClass}>
                <div>
                    Tags: <input type="text" id="tb-tp-tags-input" />
                </div>
                <div>
                    <button id="tb-tabs-add-tiddler-button">Add Tiddler</button>
                </div>
            </div>
        );
    }
    render() {
        let upperForm = this.buildFilterBox();
        let lowerForm = this.buildLowerForm();
        return (
            <div id="tb-tp-form-container">
                {upperForm}
                {lowerForm}
            </div>
        );
    }
}

export default TiddlerForm;
