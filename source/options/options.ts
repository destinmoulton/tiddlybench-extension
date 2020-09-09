import config from "../lib/storage/config";
import api from "../lib/api";
import logger from "../lib/logger";

import { API_Result } from "../types";
//import { browser } from "webextension-polyfill-ts";

window.addEventListener("load", startOptions);
function startOptions() {
    logger.log("StartOptions handler running");
    config.syncForm("options-form");
}
const testConnection: HTMLElement = <HTMLElement>(
    document.getElementById("tb-test-connection")
);
testConnection.addEventListener("click", testConnectionOptions);

const $success = <HTMLElement>(
    document.getElementById("tb-connection-success-message")
);

const $error = <HTMLElement>(
    document.getElementById("tb-connection-error-message")
);

const $reset = <HTMLElement>document.getElementById("reset-settings");

$reset.addEventListener("click", shouldReset);

async function testConnectionOptions(): Promise<API_Result> {
    const res = await api.getStatus();
    logger.log("options :: test()", res);
    if (res.ok) {
        $success.style.display = "inline-block";
    } else {
        $error.innerText = <string>res.message;
        $error.style.display = "inline-block";
    }
    return res;
}

async function shouldReset() {
    const isOk = confirm(
        "Are you sure you want reset the settings back to default?"
    );

    if (isOk) {
        await config.reset("options-form");
    }
}
