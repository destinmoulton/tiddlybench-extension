/**
 *
 * @param domIdentifier Either id, class, or querySelector path
 */
export default function dom(domIdentifier: string): any {
    if (domIdentifier.startsWith("#")) {
        const $el = document.getElementById(domIdentifier.slice(1));
        if (!$el) {
            throw new Error(
                `dom :: getElementById :: Unable to find element ${domIdentifier}`
            );
        }
        return $el;
    } else {
        const $els = [...document.querySelectorAll(domIdentifier)];
        if (!$els || $els.length === 0) {
            throw new Error(`dom :: Unable to find element ${domIdentifier}`);
        }

        if ($els.length === 1) {
            return $els.pop();
        }

        return $els;
    }
}
