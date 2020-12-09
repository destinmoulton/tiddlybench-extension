import React from "react";

import _ from "lodash";
import md5 from "md5";
import API from "../lib/API";
import ConfigStorage from "../lib/storage/ConfigStorage";
import ContextMenuStorage from "../lib/storage/ContextMenuStorage";
import LoadingAnimation from "./LoadingAnimation";
import Messenger from "../lib/Messenger";
import notify from "../lib/notify";
import TabsManager from "../lib/TabsManager";
import TiddlerListItem from "./TiddlerListItem";
import urlhashparser from "../lib/helpers/urlhashparser";

import { IDispatchOptions } from "../types";

import {
    EContextType,
    EDestinationTiddler,
    EDispatchAction,
    EDispatchSource,
} from "../enums";
type TTiddlerListItem = {
    title: string;
    id: string;
    filterable_string: string;
};
type ListState = {
    tiddlers: TTiddlerListItem[];
    visibleTiddlers: TTiddlerListItem[];
    isLoading: boolean;
};

type ListProps = {
    filterText: string;
    updateNumberVisible: (numVisible: number) => void;
};

class TiddlerList extends React.Component<ListProps, ListState> {
    api: API;
    configStorage: ConfigStorage;
    contextMenuStorage: ContextMenuStorage;
    messenger: Messenger;
    tabsManager: TabsManager;

    constructor(props: ListProps) {
        super(props);

        this.state = {
            tiddlers: [],
            visibleTiddlers: [],
            isLoading: true,
        };

        this.configStorage = new ConfigStorage();
        this.api = new API(this.configStorage);
        this.contextMenuStorage = new ContextMenuStorage(this.configStorage);
        this.messenger = new Messenger();
        this.tabsManager = new TabsManager();

        this.handleClickTiddler = this.handleClickTiddler.bind(this);
    }

    async componentDidMount() {
        await this.populateTiddlers();
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

    // Get the tiddlers from TiddlyWiki and
    // build a local copy with only a few properties
    private async populateTiddlers() {
        // TiddlyWiki API call
        const tiddlers = await this.api.getAllTiddlers();

        let localTiddlers: TTiddlerListItem[] = [];
        for (let tiddler of tiddlers) {
            // Don't need all the fields
            localTiddlers.push({
                title: tiddler.title,
                id: md5(tiddler.title),
                filterable_string: this.convertToFilterable(tiddler.title),
            });
        }
        this.setState({
            isLoading: false,
            tiddlers: localTiddlers,
            visibleTiddlers: localTiddlers,
        });
    }

    private convertToFilterable(text: string): string {
        return text
            .trim()
            .toLowerCase()
            .replace(/[^0-9a-z]/g, "");
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

    private buildList() {
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

    private getTiddlerById(id: string) {
        return this.state.tiddlers.find((tiddler) => {
            return tiddler.id === id;
        });
    }

    private async handleClickTiddler(tiddlerID: string) {
        const tiddler = this.getTiddlerById(tiddlerID);
        const cacheID = urlhashparser.getHashParamValue("cache_id");
        if (!cacheID) {
            throw new Error(
                "TiddlerList :: handleClickTiddler() :: cache_id not set as a hash parameter in the URI"
            );
        }
        if (tiddler) {
            // Add it to the context menu
            await this.contextMenuStorage.addCustomDestination({
                title: tiddler.title,
                tb_id: tiddler.id,
            });

            // Dispatch the message to add the text
            const message: IDispatchOptions = {
                source: EDispatchSource.TAB,
                action: EDispatchAction.ADD_TEXT_TO_TIDDLER,
                destination: EDestinationTiddler.CUSTOM,
                context: EContextType.SELECTION,
                packet: {
                    cache_id: cacheID,
                    tiddler_id: tiddler.id,
                    tiddler_title: tiddler.title,
                },
            };
            this.messenger.send(message, async (response) => {
                if (response.ok) {
                    await this.contextMenuStorage.removeCacheByID(cacheID);
                    notify(response.message);
                    await this.tabsManager.closeThisTab();
                }
            });
        } else {
            throw new Error(`Unable to find tiddler with id ${tiddlerID}`);
        }
    }

    render() {
        const { isLoading } = this.state;

        if (isLoading) {
            return <LoadingAnimation loadingText={"Loading Tiddlers..."} />;
        }
        return this.buildList();
    }
}

export default TiddlerList;
