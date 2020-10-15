import { IDispatchOptions } from "../../types";
import AbstractTiddler from "./AbstractTiddler";
class CustomDestination extends AbstractTiddler {
    async configure(options: IDispatchOptions) {
        if (!options.packet.tiddler_id) {
            throw new Error("tiddler_id is not defined in the options packet");
        }
        const dest = await this._contextMenuStorage.getCustomDestinationByID(
            options.packet.tiddler_id
        );

        if (!dest) {
            throw new Error(
                `The destination with id=${options.packet.tiddler_id} could not be found in the ContextMenuStorage`
            );
        }

        this._tiddlerTitle = dest.tiddler.title;
        return await this.populateTiddler();
    }
}
export default CustomDestination;
