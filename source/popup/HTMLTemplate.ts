import logger from "../lib/logger";
class HTMLTemplate {
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

    _render(html: string) {
        const $root = document.getElementById("root");

        if ($root) {
            logger.log("PopupTemplate :: adding html");
            $root.innerHTML = html;
        }
    }
}

export default HTMLTemplate;
