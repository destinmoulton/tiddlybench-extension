/**
 * options.ts
 *
 * Initialize the OptionsForm
 */

import ConfigStorage from "../lib/storage/ConfigStorage";
import OptionsForm from "./OptionsForm";

const configStorage = new ConfigStorage();
const optionsForm = new OptionsForm(configStorage);

// Initialize the OptionsForm
window.addEventListener("load", optionsForm.initialize.bind(optionsForm));
