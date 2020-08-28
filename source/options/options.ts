import optionsStorage from "../lib/options-storage";
import api from "../lib/api";
//import { browser } from "webextension-polyfill-ts";
import messenger from "../lib/messenger";

window.addEventListener("load", startOptions);

function startOptions() {
    messenger.log("options :: onload");
    optionsStorage.syncForm("#options-form");
}
const testConnection: HTMLElement = <HTMLElement>(
    document.getElementById("tb-test-connection")
);
testConnection.addEventListener("click", api.test);
