import compiletemplate from "../lib/helpers/compiletemplate";
import logger from "../lib/logger";
class PopupTemplate {
    private $root: HTMLElement;
    private loadingAnimationOldHTML: string = "";

    constructor() {
        this.$root = this.getRootElement();
    }

    private getRootElement(): HTMLElement {
        const $root = document.getElementById("tb-popup-root");

        if (!$root) {
            throw new Error("Unable to find root element.");
        }

        return $root;
    }
    protected compile(templateID: string, data: any): string {
        const $tmpl = document.getElementById(templateID);

        logger.log("PopupTemplates :: render()", templateID);

        if (!$tmpl) {
            throw new Error("Unable to find the template " + templateID);
        }
        return compiletemplate($tmpl.innerText, data);
    }

    protected render(html: string) {
        logger.log("PopupTemplate :: adding html");
        this.$root.innerHTML = html;
    }

    protected append(html: string) {
        this.$root.innerHTML = this.$root.innerHTML + html;
    }

    protected loadingAnimation(animationText: string) {
        this.loadingAnimationOldHTML = this.$root.innerHTML;

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
        this.$root.innerHTML = this.loadingAnimationOldHTML;
    }
}

export default PopupTemplate;
