'use strict';

import * as shared from 'js/shared';
import * as convert_color from 'js/convert_color';
import { inputs_data, reset_inputs_data } from 'js/inputs_data';

import { action, configure } from "mobx";
const { existsSync } = require('fs-extra');

configure({ enforceActions: 'observed' });

//> select folder and fill inputs with theme data
export const select_folder = action((folder_path, children, nest_level, i_to_insert_folfder_in) => {
    shared.ob.chosen_folder_path = folder_path;

    const folder_is_theme = children.find(file => file.name == 'manifest.json');

    if (folder_is_theme) {
        reset_inputs_data();

        shared.mut.manifest = shared.parse_json(folder_path + '/manifest.json');
        const default_locale = shared.mut.manifest.default_locale;

        for (const [name, val] of Object.entries(shared.mut.manifest)) {
            const item = shared.find_from_name(inputs_data.obj.theme_metadata, name);

            if (item) {
                const val_is_localized = shared.val_is_localized(val);

                if (val_is_localized) {
                    const message_key = shared.get_message_key(val);

                    get_theme_name_or_descrption(name, message_key, default_locale, folder_path);

                } else {
                    set_val('theme_metadata', name, val);
                }
            }
        }

        set_val('theme_metadata', 'locale', default_locale);

        if (shared.mut.manifest.theme) {
            for (const [main_key, main_val] of Object.entries(shared.mut.manifest.theme)) {
                for (const [key, val] of Object.entries(main_val)) {
                    set_val(main_key, key, val);
                }
            }
        }
    }

    convert_color.convert_all();

    mut.chosen_folder_info = {
        children: children,
        is_theme: folder_is_theme,
        nest_level: nest_level,
        i_to_insert_folfder_in: i_to_insert_folfder_in
    }
});

const get_theme_name_or_descrption = (name, message_key, default_locale, folder_path) => {
    const messages_path = folder_path + '/_locales/' + default_locale + '/messages.json';
    const messages_file_exist = existsSync(messages_path);

    if (messages_file_exist) {
        const key_exist = shared.parse_json(messages_path)[message_key]; // key ex: description, name

        if (key_exist) {
            const val = shared.parse_json(messages_path)[message_key].message;

            set_val('theme_metadata', name, val);
        }
    }
};

const set_val = (main_key, key, val) => {
    const item = shared.find_from_name(inputs_data.obj[main_key], key);

    if (item) {
        item.val = key == 'ntp_logo_alternate' ? val.toString() : val;
    }
};
//< select folder and fill inputs with theme data

//> varibles t
export const mut = {
    chosen_folder_info: {}
};
//< varibles t