/**
 * ResetOptionsForm.ts
 *
 * @class ResetOptionsForm
 *
 * Handle the Reset Options button.
 * -- Setup the button handler
 * -- Show confirmation dialog if button clicked
 * -- Reset the form if confirmation is Ok
 */
import ConfigStorage from "../../lib/storage/ConfigStorage";
import dom from "../../lib/dom";
class ResetOptionsForm {
    private configStorage: ConfigStorage;
    private $resetFormButton: HTMLElement | null;

    constructor(configStorage: ConfigStorage) {
        this.configStorage = configStorage;
        this.$resetFormButton = null;
    }

    initialize() {
        this.$resetFormButton = <HTMLElement>dom.el("#reset-settings");
        this.$resetFormButton.addEventListener(
            "click",
            this.handleResetForm.bind(this)
        );
    }

    private async handleResetForm() {
        const isOk = confirm(
            "Are you sure you want reset the settings back to default?"
        );

        if (isOk) {
            await this.configStorage.reset("options-form");
        }
    }
}

export default ResetOptionsForm;
