import React from "react";

type ItemProps = {
    title: string;
    id: string;
    clickHandler: (tiddlerId: string) => void;
};

const TiddlerListItem: React.FunctionComponent<ItemProps> = ({
    title,
    id,
    clickHandler,
}) => {
    return (
        <li
            className="tb-tabs-tiddlers-list-item"
            onClick={() => {
                clickHandler(id);
            }}
        >
            {title}
        </li>
    );
};

export default TiddlerListItem;
