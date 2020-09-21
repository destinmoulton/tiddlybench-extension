import compiletemplate from "../lib/helpers/compiletemplate";
import logger from "../lib/logger";
class PopupTemplate {
    _$root: HTMLElement;
    _loadingAnimationOldHTML: string = "";

    constructor() {
        this._$root = this._getRootElement();
    }

    _getRootElement(): HTMLElement {
        const $root = document.getElementById("tb-popup-root");

        if (!$root) {
            throw new Error("Unable to find root element.");
        }

        return $root;
    }
    _compile(templateID: string, data: any): string {
        const $tmpl = document.getElementById(templateID);

        logger.log("PopupTemplates :: render()", templateID);

        if (!$tmpl) {
            throw new Error("Unable to find the template " + templateID);
        }
        return compiletemplate($tmpl.innerText, data);
    }

    _render(html: string) {
        logger.log("PopupTemplate :: adding html");
        this._$root.innerHTML = html;
    }

    _append(html: string) {
        this._$root.innerHTML = this._$root.innerHTML + html;
    }

    _loadingAnimation(animationText: string) {
        this._loadingAnimationOldHTML = this._$root.innerHTML;

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
        this._$root.innerHTML = this._loadingAnimationOldHTML;
    }
}

export default PopupTemplate;
