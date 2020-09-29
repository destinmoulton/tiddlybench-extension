/**
 * options.ts
 *
 * Initialize the OptionsForm
 */
import API from "../lib/API";
import ConfigStorage from "../lib/storage/ConfigStorage";
import OptionsForm from "./OptionsForm";
//import TabsManager from "../lib/TabsManager";

const configStorage = new ConfigStorage();
//const tabsManager = new TabsManager();
const api = new API(configStorage);
const optionsForm = new OptionsForm(api, configStorage);

// Initialize the OptionsForm
window.addEventListener("load", optionsForm.display.bind(optionsForm));
