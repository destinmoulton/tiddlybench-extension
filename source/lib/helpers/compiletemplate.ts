/**
 * compiletemplate.ts
 *
 * A helper method to compile a basic template
 * with possible data template tags.
 *
 * Templates can include data template tags:
 *    {{<name_of_property>}}
 *
 */

export default function compiletemplate(template: string, data: any): string {
    let compiled = template;
    const keys = Object.keys(data);

    keys.forEach((key) => {
        // prettier-ignore
        const rgx = new RegExp('{{\\s*' + key + '\\s*}}', "g");
        if (compiled.search(rgx) >= 0) {
            compiled = compiled.replaceAll(rgx, data[key]);
        }
    });

    return compiled;
}
