/**
 * TestConnection.ts
 *
 * @class TestConnection
 *
 * TestConnection handles clicking the Test Connection button,
 * handling the test api call, and displaying error
 * or success messages.
 */

import API from "../../lib/API";
import dom from "../../lib/dom";
import logger from "../../lib/logger";
import { EConfigKey } from "../../enums";
//import { API_Result } from "../../types";
class TestConnection {
    _api: API;
    $testConnectionButton: HTMLElement | null;
    $testConnectionSuccessMessage: HTMLElement | null;
    $testConnectionErrorMessage: HTMLElement | null;
    $url: HTMLInputElement | null;
    $username: HTMLInputElement | null;
    $password: HTMLInputElement | null;

    constructor(api: API) {
        this._api = api;
        this.$testConnectionButton = null;
        this.$testConnectionSuccessMessage = null;
        this.$testConnectionErrorMessage = null;
        this.$url = null;
        this.$username = null;
        this.$password = null;
    }

    initialize() {
        this.$testConnectionButton = <HTMLElement>dom.el("#tb-test-connection");
        this.$testConnectionButton.addEventListener(
            "click",
            this.handleClickTestConnectionButton.bind(this)
        );

        this.$testConnectionSuccessMessage = <HTMLElement>(
            dom.el("#tb-connection-success-message")
        );
        this.$testConnectionErrorMessage = <HTMLElement>(
            dom.el("#tb-connection-error-message")
        );

        this.$url = <HTMLInputElement>dom.el("#" + EConfigKey.SERVER_URL);
        this.$username = <HTMLInputElement>(
            dom.el("#" + EConfigKey.SERVER_USERNAME)
        );
        this.$password = <HTMLInputElement>(
            dom.el("#" + EConfigKey.SERVER_PASSWORD)
        );
    }

    async handleClickTestConnectionButton(): Promise<boolean> {
        if (this._validate()) {
            const res = await this._api.getStatus();
            if (res.ok) {
                this._showSuccessMessage();
                return true;
            } else {
                this._showErrorMessage(<string>res.message);
            }
        }
        return false;
    }

    private _validate() {
        if (this.$url) {
            const url = this.$url.value;
            if (url.trim() === "") {
                this._showErrorMessage("You must include a URL");
                return false;
            }
        }
        if (this.$username) {
            const username = this.$username.value;
            if (username.trim() === "") {
                this._showErrorMessage("You must include a username.");
                return false;
            }
        }
        if (this.$password) {
            const username = this.$password.value;
            if (username.trim() === "") {
                this._showErrorMessage("You must include a password.");
                return false;
            }
        }
        return true;
    }

    private _showSuccessMessage() {
        this._hideErrorMessage();
        if (this.$testConnectionSuccessMessage) {
            this.$testConnectionSuccessMessage.style.display = "inline-block";
        } else {
            logger.error(
                "OptionsForm :: testConnectionOptions() ;; this.$testConnectionSuccessMessage is null."
            );
        }
    }

    private _hideSuccessMessage() {
        if (this.$testConnectionSuccessMessage) {
            this.$testConnectionSuccessMessage.style.display = "none";
        } else {
            logger.error(
                "OptionsForm :: testConnectionOptions() ;; this.$testConnectionSuccessMessage is null."
            );
        }
    }
    private _showErrorMessage(message: string) {
        this._hideSuccessMessage();
        if (this.$testConnectionErrorMessage) {
            this.$testConnectionErrorMessage.innerText = <string>message;
            this.$testConnectionErrorMessage.style.display = "inline-block";
        } else {
            logger.error(
                "TestConnection :: _showErrorMessage() ||  this.$testConnectionErrorMessage is null."
            );
        }
    }

    private _hideErrorMessage() {
        if (this.$testConnectionErrorMessage) {
            this.$testConnectionErrorMessage.innerText = "";
            this.$testConnectionErrorMessage.style.display = "none";
        } else {
            logger.error(
                "TestConnection :: _showErrorMessage() ||  this.$testConnectionErrorMessage is null."
            );
        }
    }
}

export default TestConnection;
