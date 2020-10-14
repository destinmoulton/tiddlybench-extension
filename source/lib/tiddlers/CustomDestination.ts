import { IDispatchOptions } from "../../types";
import AbstractTiddler from "./AbstractTiddler";
class CustomDestination extends AbstractTiddler {
    async populateTitle(options: IDispatchOptions) {
        if (!options.packet.cache_id) {
            throw new Error("id is not defined in the options");
        }
        const dest = await this._contextMenuStorage.getCustomDestinationByID(
            options.packet.cache_id
        );

        if (!dest) {
            throw new Error(
                `The destination with id=${options.packet.cache_id} could not be found in the ContextMenuStorage`
            );
        }

        this._tiddlerTitle = dest.tiddler.title;
    }
}
export default CustomDestination;
