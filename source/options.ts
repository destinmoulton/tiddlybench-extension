import optionsStorage from "./options-storage";
import api from "./api";
//import { browser } from "webextension-polyfill-ts";
import messenger from "./messenger";

window.addEventListener("load", startOptions);

function startOptions() {
    messenger.log("options :: onload");
    optionsStorage.syncForm("#options-form");
}
const testConnection: HTMLElement = <HTMLElement>(
    document.getElementById("tb-test-connection")
);
testConnection.addEventListener("click", api.test);
