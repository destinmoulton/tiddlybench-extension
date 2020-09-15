/**
 * OptionsForm.ts
 *
 * Define the OptionsForm class.
 *
 * OptionsForm interfaces with ConfigStorage to
 * load and store options from the local browser storage
 * system.
 */

import API from "../lib/API";
import ConfigStorage from "../lib/storage/ConfigStorage";
import TestConnection from "./sections/TestConnection";
import ResetOptionsForm from "./sections/ResetOptionsForm";
//import dom from "../lib/dom";
//import logger from "../lib/logger";

class OptionsForm {
    _api: API;
    _configStorage: ConfigStorage;
    _testConnection: TestConnection;
    _resetOptionsForm: ResetOptionsForm;

    constructor(api: API, configStorage: ConfigStorage) {
        this._api = api;
        this._configStorage = configStorage;
        this._testConnection = new TestConnection(this._api);
        this._resetOptionsForm = new ResetOptionsForm(configStorage);
    }

    initialize() {
        this._testConnection.initialize();
        this._resetOptionsForm.initialize();
        this._configStorage.syncForm("options-form");
    }
}

export default OptionsForm;
