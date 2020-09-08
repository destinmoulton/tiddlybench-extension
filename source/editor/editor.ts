//import editortabs from "../lib/editortabs";
//import editorcache from "../lib/storage/tiddlerdrafts";

window.addEventListener("load", () => {
    const editor = new Editor();
    editor.initialize();
});
class Editor {
    initialize() {
        var urlParams = new URLSearchParams(window.location.hash.substr(1));
        var tab_id = urlParams.get("id");

        if (tab_id) {
        }
    }
}
