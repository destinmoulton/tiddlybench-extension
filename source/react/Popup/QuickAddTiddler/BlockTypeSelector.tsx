import React from "react";

import { EBlockType } from "../../../enums";
import { BLOCK_TYPES } from "../../../constants";

type BlockType = {
    selectedBlockType: string;
    handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};
const BlockTypeSelector: React.FunctionComponent<BlockType> = ({
    selectedBlockType,
    handleChange,
}) => {
    let options: JSX.Element[] = [];
    let blockKey: EBlockType;
    for (blockKey in BLOCK_TYPES) {
        const blockName = BLOCK_TYPES[blockKey];

        options.push(
            <option key={blockKey} value={blockKey}>
                {blockName}
            </option>
        );
    }
    return (
        <select onChange={handleChange} value={selectedBlockType}>
            {options}
        </select>
    );
};

export default BlockTypeSelector;
