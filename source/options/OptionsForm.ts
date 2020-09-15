/**
 * OptionsForm.ts
 *
 * Define the OptionsForm class.
 *
 * OptionsForm interfaces with ConfigStorage to
 * load and store options from the local browser storage
 * system.
 */

import ConfigStorage from "../lib/storage/ConfigStorage";
import TestConnection from "./sections/TestConnection";
import dom from "../lib/dom";
//import logger from "../lib/logger";

class OptionsForm {
    _configStorage: ConfigStorage;
    _testConnection: TestConnection;
    $resetFormButton: HTMLElement | null;

    constructor(configStorage: ConfigStorage) {
        this._configStorage = configStorage;
        this._testConnection = new TestConnection();
        this.$resetFormButton = null;
    }

    initialize() {
        this._testConnection.initialize();
        this.$resetFormButton = <HTMLElement>dom("#reset-settings");
        this.$resetFormButton.addEventListener(
            "click",
            this.handleResetForm.bind(this)
        );
        this._configStorage.syncForm("options-form");
    }

    async handleResetForm() {
        const isOk = confirm(
            "Are you sure you want reset the settings back to default?"
        );

        if (isOk) {
            await this._configStorage.reset("options-form");
        }
    }
}

export default OptionsForm;
