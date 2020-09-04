import editorcache from "../lib/storage/editorcache";

window.addEventListener("load", () => {
    const editor = new Editor();
    editor.initialize();
});
class Editor {
    initialize() {
        editorcache.syncForm("tiddler-editor-form");
    }
}
