import AbstractTiddler from "./AbstractTiddler";
class CustomDestination extends AbstractTiddler {
    async configure() {
        return await this.populateTiddler();
    }
}
export default CustomDestination;
