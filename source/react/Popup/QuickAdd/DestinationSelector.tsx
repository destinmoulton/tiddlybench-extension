import React from "react";
import { EQuickAddDestinations } from "../../../enums";
import { QUICK_ADD_DESTINATIONS } from "../../../constants";
type Props = {
    selectedDestination: string;
    handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const DestinationSelector: React.FunctionComponent<Props> = ({
    selectedDestination,
    handleChange,
}) => {
    let options: JSX.Element[] = [];
    let destination: EQuickAddDestinations;
    for (destination in QUICK_ADD_DESTINATIONS) {
        const destinationTitle = QUICK_ADD_DESTINATIONS[destination];

        options.push(
            <option key={destination} value={destination}>
                {destinationTitle}
            </option>
        );
    }
    return (
        <span>
            <label htmlFor="tb-popup-quickadd-type">Quick Add to</label>
            <select
                id="tb-popup-quickadd-type"
                onChange={handleChange}
                value={selectedDestination}
            >
                {options}
            </select>
        </span>
    );
};
export default DestinationSelector;
