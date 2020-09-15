/**
 * TestConnection.ts
 *
 * @class TestConnection
 *
 * TestConnection handles clicking the Test Connection button,
 * handling the test api call, and displaying error
 * or success messages.
 */

import api from "../../lib/api";
import dom from "../../lib/dom";
import logger from "../../lib/logger";
import { API_Result } from "../../types";
class TestConnection {
    $testConnectionButton: HTMLElement | null;
    $testConnectionSuccessMessage: HTMLElement | null;
    $testConnectionErrorMessage: HTMLElement | null;

    constructor() {
        this.$testConnectionButton = null;
        this.$testConnectionSuccessMessage = null;
        this.$testConnectionErrorMessage = null;
    }

    initialize() {
        this.$testConnectionButton = <HTMLElement>dom("#tb-test-connection");
        this.$testConnectionButton.addEventListener(
            "click",
            this.testConnectionOptions.bind(this)
        );

        this.$testConnectionSuccessMessage = <HTMLElement>(
            dom("#tb-connection-success-message")
        );
        this.$testConnectionErrorMessage = <HTMLElement>(
            dom("#tb-connection-error-message")
        );
    }

    async testConnectionOptions(): Promise<API_Result> {
        const res = await api.getStatus();
        if (res.ok) {
            this._showSuccessMessage();
        } else {
            this._showErrorMessage(<string>res.message);
        }
        return res;
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