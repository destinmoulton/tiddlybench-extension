/**
 * ListTiddlers.ts
 *
 * @class ListTiddlers
 *
 */
import AbstractTabSection from "./AbstractTabSection";
export default class ListTiddlers extends AbstractTabSection {
    async display() {
        this._loadingAnimation("Getting Tiddlers...");
        if (!this._api.isServerUp) {
            return;
        }
        const tiddlers = await this._api.getAllTiddlers();
        const liTmpl = "tmpl-list-tiddlers-item";

        const listItems = [];
        for (let tiddler of tiddlers) {
            const cmp = this._compile(liTmpl, { tiddler_title: tiddler.title });
            listItems.push(cmp);
        }
        const compiled = this._compile("tmpl-list-tiddlers", {
            tiddlers: listItems.join(""),
        });
        this._render(compiled);
    }
}
