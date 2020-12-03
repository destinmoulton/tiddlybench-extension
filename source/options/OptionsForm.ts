/**
 * OptionsForm.ts
 *
 * Define the OptionsForm class.
 *
 * OptionsForm interfaces with ConfigStorage to
 * load and store options from the local browser storage
 * system.
 */
import _ from "lodash";
import API from "../lib/API";
import ConfigStorage from "../lib/storage/ConfigStorage";
import TestConnection from "./sections/TestConnection";
import ResetOptionsForm from "./sections/ResetOptionsForm";
import dom from "../lib/dom";
import FORM_SECTIONS from "./form_fields";
import compiletemplate from "../lib/helpers/compiletemplate";
import { TFormInputOptions } from "../types";
//import logger from "../lib/logger";

class OptionsForm {
    private api: API;
    private configStorage: ConfigStorage;
    private testConnection: TestConnection;
    private resetOptionsForm: ResetOptionsForm;

    private html = {
        label: "",
        input: {
            text: "",
            password: "",
            select: "",
            option: "",
        },

        section: "",
        group: "",
    };

    constructor(api: API, configStorage: ConfigStorage) {
        this.api = api;
        this.configStorage = configStorage;
        this.testConnection = new TestConnection(this.api);
        this.resetOptionsForm = new ResetOptionsForm(configStorage);
    }

    public display() {
        this.loadAllHTMLTemplates();
        this.buildForm();
        this.testConnection.initialize();
        this.resetOptionsForm.initialize();
        this.configStorage.syncForm("options-form");
    }

    private loadAllHTMLTemplates() {
        this.html = {
            label: this.getTemplate("tmpl-form-label"),
            input: {
                text: this.getTemplate("tmpl-form-input-text"),
                password: this.getTemplate("tmpl-form-input-password"),
                select: this.getTemplate("tmpl-form-input-select"),
                option: this.getTemplate("tmpl-form-input-select-option"),
            },
            section: this.getTemplate("tmpl-form-section"),
            group: this.getTemplate("tmpl-form-group"),
        };
    }

    private getTemplate(templateID: string) {
        const $el = <HTMLElement>dom.el("#" + templateID);
        return $el.innerHTML;
    }

    private buildForm() {
        let html = "";
        for (let section of FORM_SECTIONS) {
            let groups = [];
            for (let field of section.fields) {
                const opts = {
                    id: field.id,
                };
                let input = "";
                let label = compiletemplate(this.html.label, {
                    id: field.id,
                    label: field.label,
                });
                switch (field.type) {
                    case "text":
                        input = compiletemplate(this.html.input.text, opts);
                        break;
                    case "password":
                        input = compiletemplate(this.html.input.password, opts);
                        break;
                    case "select": {
                        if (field.options) {
                            input = compiletemplate(this.html.input.select, {
                                ...opts,
                                options: this.buildSelectOptions(field.options),
                            });
                        }
                        break;
                    }
                    case "template": {
                        if (field.template_id) {
                            label = ""; // no need for label for template
                            const $template = <HTMLElement>(
                                dom.el("#" + field.template_id)
                            );
                            input = compiletemplate($template.innerHTML, {});
                        }
                    }
                }
                groups.push(compiletemplate(this.html.group, { label, input }));
            }
            html += compiletemplate(this.html.section, {
                section_icon: section.section_icon,
                section_title: section.section_title,
                section_subheading: section.section_subheading,
                section_notes: section.section_notes.join(),
                groups: groups.join(""),
            });
        }
        const $root = <HTMLElement>dom.el("#root");
        $root.innerHTML = html;
    }

    private buildSelectOptions(options: TFormInputOptions) {
        let html = [];
        if (_.isArray(options)) {
            for (let option of options) {
                html.push(
                    compiletemplate(this.html.input.option, {
                        value: option,
                        option,
                    })
                );
            }
        } else if (_.isObject(options)) {
            for (let value in options) {
                const option = options[value];
                html.push(
                    compiletemplate(this.html.input.option, { value, option })
                );
            }
        }
        return html.join("");
    }
}

export default OptionsForm;
