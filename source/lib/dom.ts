
/**
 * 
 * Get a single dom element.
 * 
 * Use els() to get an array of elements.
 * 
 * @param elIdentifier string
 */
function el(identifier: string): HTMLElement | HTMLInputElement | null{
    let $el;
    if (identifier.startsWith("#")) {
        $el = document.getElementById(identifier.slice(1));
        if (!$el) {
            return null;
        }
    } else {
        const $els = [...document.querySelectorAll(identifier)];
        if (!$els || $els.length === 0) {
            return null;
        }

        if($els.length > 1){
            throw new Error(`dom.el() :: Found more than one instance of ${identifier} use els() instead`)
        }
        $el = $els.pop();
        if(!$el){
            return null;
        }
    }

    switch(typeOfEl($el)){
        case "HTMLInputElement":
            return <HTMLInputElement>$el;
        case "HTMLElement":
            return <HTMLElement>$el;
        default: 
            throw new Error("dom.el() :: Unknown element type ")
    }
}

/**
 * Get an array of dom elements and cast them.
 * 
 * Use el() to get a single dom element.
 * 
 * @param identifier string
 */
function els(identifier: string): HTMLElement[] | HTMLInputElement[]{
    const $els = [...document.querySelectorAll(identifier)];
    if (!$els || $els.length === 0) {
        return [];
    }

    // Do some "dirty" casting.
    switch(typeOfEl($els[0])){
        case "HTMLInputElement":
            return <HTMLInputElement[]>$els;
        default:
            return <HTMLElement[]>$els;
    }
}

function typeOfEl(domElement: Element): string{
    if (domElement instanceof HTMLInputElement){
        return "HTMLInputElement";
    } 
    return "HTMLElement";
}

export default {el, els};
export {el, els};