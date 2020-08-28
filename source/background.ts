import optionsStorage from "./options-storage";
//import { browser } from "webextension-polyfill-ts";
import messenger from "./messenger";

messenger.setup();
console.log("tiddlybench :: background.ts LOADED V2");

(async function() {
    const options = await optionsStorage.getAll();
    console.log(options);
})();
