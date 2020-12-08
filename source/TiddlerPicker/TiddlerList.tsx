import React from "react";

import _ from "lodash";
import md5 from "md5";
import API from "../lib/API";
import ConfigStorage from "../lib/storage/ConfigStorage";

import TiddlerListItem from "./TiddlerListItem";

type TTiddlerListItem = {
    title: string;
    id: string;
    filterable_string: string;
};
type ListState = {
    tiddlers: TTiddlerListItem[];
    visibleTiddlers: TTiddlerListItem[];
};

type ListProps = {
    filterText: string;
    updateNumberVisible: (numVisible: number) => void;
};

class TiddlerList extends React.Component<ListProps, ListState> {
    api: API;
    configStorage: ConfigStorage;

    constructor(props: ListProps) {
        super(props);

        this.state = {
            tiddlers: [],
            visibleTiddlers: [],
        };

        this.configStorage = new ConfigStorage();
        this.api = new API(this.configStorage);

        this.handleClickTiddler = this.handleClickTiddler.bind(this);
    }

    async componentDidMount() {
        await this.populateTiddlers();
    }

    private async populateTiddlers() {
        const tiddlers = await this.api.getAllTiddlers();

        let localTiddlers: TTiddlerListItem[] = [];
        for (let tiddler of tiddlers) {
            localTiddlers.push({
                title: tiddler.title,
                id: md5(tiddler.title),
                filterable_string: this.convertToFilterable(tiddler.title),
            });
        }
        this.setState({
            tiddlers: localTiddlers,
            visibleTiddlers: localTiddlers,
        });
    }

    private handleClickTiddler(tiddlerId: string) {
        console.log(
            "TiddlerList :: handleClickTiddler() :: SELECTED tiddler ",
            tiddlerId
        );
    }
    private convertToFilterable(text: string): string {
        return text
            .trim()
            .toLowerCase()
            .replace(/[^0-9a-z]/g, "");
    }
    componentDidUpdate(prevProps: ListProps) {
        const { filterText } = this.props;
        if (prevProps.filterText !== filterText) {
            if (filterText !== "") {
                this.filterVisibleTiddlers();
            } else {
                this.setState({
                    visibleTiddlers: _.cloneDeep(this.state.tiddlers),
                });
            }
        }
    }

    private filterVisibleTiddlers() {
        const { filterText, updateNumberVisible } = this.props;
        const { tiddlers } = this.state;
        const search = this.convertToFilterable(filterText);
        const matchingTiddlers = tiddlers.filter((tiddler) => {
            // Only show tiddlers that match the filter terms
            return tiddler.filterable_string.includes(search);
        });
        updateNumberVisible(matchingTiddlers.length);
        this.setState({ visibleTiddlers: matchingTiddlers });
    }

    render() {
        const { visibleTiddlers } = this.state;

        const items = visibleTiddlers.map((tiddler) => {
            // Only show tiddlers that match the filter terms
            return (
                <TiddlerListItem
                    title={tiddler.title}
                    id={tiddler.id}
                    clickHandler={this.handleClickTiddler}
                    key={tiddler.id}
                />
            );
        });

        return (
            <div className="tb-tp-tiddlers-list-container">
                <ul>{items}</ul>
            </div>
        );
    }
}

export default TiddlerList;
