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
    protected abstract display: () => void;
    protected _loadingAnimationOldHTML: string;
    constructor(api: API) {
        this._api = api;
        this._$root = null;
        this._loadingAnimationOldHTML = "";
    }

    _setRoot(rootID: string) {
        this._$root = <HTMLElement>dom("#" + rootID);
    }
    _compile(templateID: string, data: any): string {
        const $tmpl = <HTMLElement>dom("#" + templateID);

        if (!$tmpl) {
            throw new Error("Unable to find the template " + templateID);
        }
        return compiletemplate($tmpl.innerText, data);
    }

    _render(html: string) {
        if (this._$root) {
            this._$root.innerHTML = html;
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
}
export default AbstractTabSection;
