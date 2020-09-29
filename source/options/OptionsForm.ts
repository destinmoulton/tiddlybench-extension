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
    _api: API;
    _configStorage: ConfigStorage;
    _testConnection: TestConnection;
    _resetOptionsForm: ResetOptionsForm;

    _html = {
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
        this._api = api;
        this._configStorage = configStorage;
        this._testConnection = new TestConnection(this._api);
        this._resetOptionsForm = new ResetOptionsForm(configStorage);
    }

    display() {
        this._loadAllHTMLTemplates();
        this._buildForm();
        this._testConnection.initialize();
        this._resetOptionsForm.initialize();
        this._configStorage.syncForm("options-form");
    }

    _loadAllHTMLTemplates() {
        this._html = {
            label: this._getTemplate("tmpl-form-label"),
            input: {
                text: this._getTemplate("tmpl-form-input-text"),
                password: this._getTemplate("tmpl-form-input-password"),
                select: this._getTemplate("tmpl-form-input-select"),
                option: this._getTemplate("tmpl-form-input-select-option"),
            },
            section: this._getTemplate("tmpl-form-section"),
            group: this._getTemplate("tmpl-form-group"),
        };
    }

    _getTemplate(templateID: string) {
        const $el = <HTMLElement>dom("#" + templateID);
        return $el.innerHTML;
    }

    _buildForm() {
        let html = "";
        for (let section of FORM_SECTIONS) {
            let groups = [];
            for (let field of section.fields) {
                const opts = {
                    id: field.id,
                };
                let input = "";
                let label = compiletemplate(this._html.label, {
                    id: field.id,
                    label: field.label,
                });
                switch (field.type) {
                    case "text":
                        input = compiletemplate(this._html.input.text, opts);
                        break;
                    case "password":
                        input = compiletemplate(
                            this._html.input.password,
                            opts
                        );
                        break;
                    case "select": {
                        if (field.options) {
                            input = compiletemplate(this._html.input.select, {
                                ...opts,
                                options: this._buildSelectOptions(
                                    field.options
                                ),
                            });
                        }
                        break;
                    }
                    case "template": {
                        if (field.template_id) {
                            const $template = <HTMLElement>(
                                dom("#" + field.template_id)
                            );
                            input = compiletemplate($template.innerHTML, {});
                        }
                    }
                }
                groups.push(
                    compiletemplate(this._html.group, { label, input })
                );
            }
            html += compiletemplate(this._html.section, {
                section_title: section.section_title,
                section_subheading: section.section_subheading,
                section_notes: section.section_notes.join(),
                groups: groups.join(""),
            });
        }
        const $root = <HTMLElement>dom("#root");
        $root.innerHTML = html;
    }

    _buildSelectOptions(options: TFormInputOptions) {
        let html = [];
        if (_.isArray(options)) {
            for (let option of options) {
                html.push(
                    compiletemplate(this._html.input.option, {
                        value: option,
                        option,
                    })
                );
            }
        } else if (_.isObject(options)) {
            for (let value in options) {
                const option = options[value];
                html.push(
                    compiletemplate(this._html.input.option, { value, option })
                );
            }
        }
        return html.join("");
    }
}

export default OptionsForm;
