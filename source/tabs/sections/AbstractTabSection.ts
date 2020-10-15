/**
 * AbstractTabSection.ts
 *
 * @class AbstractSection
 *
 * Provide abstract for the Tabs Sections.
 */
import API from "../../lib/API";
import compiletemplate from "../../lib/helpers/compiletemplate";
import dom from "../../lib/dom";
abstract class AbstractTabSection {
    protected _$root: HTMLElement | null;
    protected _api: API;
    abstract display(): void;
    protected _loadingAnimationOldHTML: string;
    constructor(api: API) {
        this._api = api;
        this._$root = null;
        this._loadingAnimationOldHTML = "";
    }

    initialize(rootElementID: string) {
        this._$root = <HTMLElement>dom("#" + rootElementID);
    }

    _compile(templateID: string, data: any): string {
        const $tmpl = <HTMLElement>dom("#" + templateID);

        if (!$tmpl) {
            throw new Error("Unable to find the template " + templateID);
        }
        return compiletemplate($tmpl.innerText, data);
    }

    _render(html: string) {
        console.log("About to render", html);

        if (this._$root) {
            this._$root.innerHTML = html;
        } else {
            throw new Error("root element is not defined");
        }
    }

    _loadingAnimation(animationText: string) {
        if (this._$root) {
            this._loadingAnimationOldHTML = this._$root.innerHTML;
        }

        const loaderHTML = this._getLoadingAnimationHTML(animationText);

        this._render(loaderHTML);
    }

    _getLoadingAnimationHTML(loadingText: string) {
        return this._compile("tmpl-loading-animation", {
            text: loadingText,
        });
    }

    // Return the root to the old HTML
    _cancelLoadingAnimation() {
        if (this._$root) {
            this._$root.innerHTML = this._loadingAnimationOldHTML;
        }
    }

    _getHashParams() {
        return new URLSearchParams(window.location.hash.substr(1));
    }
}
export default AbstractTabSection;
