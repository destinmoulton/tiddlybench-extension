import mainmenu from "./MainMenu";
import quickAddTiddler from "./QuickAddTiddler";

window.addEventListener("load", function() {
    mainmenu.show();
    quickAddTiddler.display();
});
