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
import { EConfigKey } from "../../enums";

class TestConnection {
    private api: API;
    private $testConnectionButton: HTMLElement | null;
    private $testConnectionSuccessMessage: HTMLElement | null;
    private $testConnectionErrorMessage: HTMLElement | null;
    private $url: HTMLInputElement | null;
    private $username: HTMLInputElement | null;
    private $password: HTMLInputElement | null;

    constructor(api: API) {
        this.api = api;
        this.$testConnectionButton = null;
        this.$testConnectionSuccessMessage = null;
        this.$testConnectionErrorMessage = null;
        this.$url = null;
        this.$username = null;
        this.$password = null;
    }

    public initialize() {
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

    private async handleClickTestConnectionButton(): Promise<boolean> {
        if (this.validate()) {
            const res = await this.api.getStatus();
            if (res.ok) {
                this.showSuccessMessage();
                return true;
            } else {
                this.showErrorMessage(<string>res.message);
            }
        }
        return false;
    }

    private validate() {
        if (this.$url) {
            const url = this.$url.value;
            if (url.trim() === "") {
                this.showErrorMessage("You must include a URL");
                return false;
            }
        }
        if (this.$username) {
            const username = this.$username.value;
            if (username.trim() === "") {
                this.showErrorMessage("You must include a username.");
                return false;
            }
        }
        if (this.$password) {
            const username = this.$password.value;
            if (username.trim() === "") {
                this.showErrorMessage("You must include a password.");
                return false;
            }
        }
        return true;
    }

    private showSuccessMessage() {
        this.hideErrorMessage();
        if (this.$testConnectionSuccessMessage) {
            this.$testConnectionSuccessMessage.style.display = "inline-block";
        }
    }

    private hideSuccessMessage() {
        if (this.$testConnectionSuccessMessage) {
            this.$testConnectionSuccessMessage.style.display = "none";
        }
    }

    private showErrorMessage(message: string) {
        this.hideSuccessMessage();
        if (this.$testConnectionErrorMessage) {
            this.$testConnectionErrorMessage.innerText = <string>message;
            this.$testConnectionErrorMessage.style.display = "inline-block";
        }
    }

    private hideErrorMessage() {
        if (this.$testConnectionErrorMessage) {
            this.$testConnectionErrorMessage.innerText = "";
            this.$testConnectionErrorMessage.style.display = "none";
        }
    }
}

export default TestConnection;
