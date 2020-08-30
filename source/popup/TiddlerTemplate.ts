import logger from "../lib/logger";
class TiddlerTemplate {
    _compile(templateID: string, data: any): string {
        const $tmpl = document.getElementById(templateID);

        logger.log("PopupTemplates :: render()", templateID);

        if ($tmpl) {
            var tmplTxt = $tmpl.innerText;

            const keys = Object.keys(data);

            keys.forEach((key) => {
                // prettier-ignore
                const rgx = new RegExp('{{\\s*' + key + '\\s*}}', "g");
                logger.log(rgx);
                if (tmplTxt.search(rgx) >= 0) {
                    logger.log("PopupTemplate :: _compile :: search found");
                    tmplTxt = tmplTxt.replace(rgx, data[key]);
                }
            });

            return tmplTxt;
        }
        return "";
    }

    showMenu() {
        const html = this._compile("tmpl-main-menu", {});

        this._render(html);

        const $link = document.getElementById("tb-link-add-tiddler");
        if ($link) {
            $link.addEventListener("click", this.showTiddlerForm.bind(this));
        }
    }
    _render(html: string) {
        const $root = document.getElementById("root");

        if ($root) {
            logger.log("PopupTemplate :: adding html");
            $root.innerHTML = html;
        }
    }
}

export default TiddlerTemplate;
