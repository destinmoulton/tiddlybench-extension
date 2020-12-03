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
    protected $root: HTMLElement | null;
    protected api: API;
    abstract display(): void;
    protected loadingAnimationOldHTML: string;
    constructor(api: API) {
        this.api = api;
        this.$root = null;
        this.loadingAnimationOldHTML = "";
    }

    initialize(rootElementID: string) {
        this.$root = <HTMLElement>dom.el("#" + rootElementID);
    }

    protected compile(templateID: string, data: any): string {
        const $tmpl = <HTMLElement>dom.el("#" + templateID);

        if (!$tmpl) {
            throw new Error("Unable to find the template " + templateID);
        }
        return compiletemplate($tmpl.innerText, data);
    }

    protected render(html: string) {
        console.log("About to render", html);

        if (this.$root) {
            this.$root.innerHTML = html;
        } else {
            throw new Error("root element is not defined");
        }
    }

    protected loadingAnimation(animationText: string) {
        if (this.$root) {
            this.loadingAnimationOldHTML = this.$root.innerHTML;
        }

        const loaderHTML = this.getLoadingAnimationHTML(animationText);

        this.render(loaderHTML);
    }

    protected getLoadingAnimationHTML(loadingText: string) {
        return this.compile("tmpl-loading-animation", {
            text: loadingText,
        });
    }

    // Return the root to the old HTML
    protected cancelLoadingAnimation() {
        if (this.$root) {
            this.$root.innerHTML = this.loadingAnimationOldHTML;
        }
    }

    protected getHashParams() {
        return new URLSearchParams(window.location.hash.substr(1));
    }

    // Get the cache_id from the query string
    protected getCacheID(): string {
        const urlParams = this.getHashParams();
        const cacheID = urlParams.get("cache_id");

        if (!cacheID) {
            throw new Error(
                "AbstractTabSection :: getCacheID() :: can't tet cache_id in uri params"
            );
        }
        return cacheID;
    }
}
export default AbstractTabSection;
