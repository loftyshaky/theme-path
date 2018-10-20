'use_strict';

import * as shared from 'js/shared';
import * as work_folder from 'js/work_folder';
import * as open_and_pack from 'js/open_and_pack';
import { inputs_data } from 'js/inputs_data';
import { action, configure } from "mobx";
const { existsSync, mkdirSync, writeFileSync } = require('fs');
const Store = require('electron-store');

const store = new Store();

configure({ enforceActions: 'observed' });

export const change_val = action((family, i, val, img_extension, e) => {
    const new_val = val == 'is_not_select' ? e.target.value : val;
    const key = inputs_data.obj[family][i].name;
    const manifest_path = shared.ob.chosen_folder_path + '\\manifest.json';
    const first_if_keys = ['name', 'description'];
    const second_if_keys = ['version', 'default_locale'];
    const third_if_keys = ['colors', 'tints', 'properties'];

    inputs_data.obj[family][i].val = new_val;

    if (first_if_keys.indexOf(key) > -1) {
        set_name_or_description_prop(key, e.target.value);

        if (key === 'name') {
            work_folder.rename_theme_folder(shared.ob.chosen_folder_path, new_val);
        }

    } else if (second_if_keys.indexOf(key) > -1) {
        write_to_json(shared.mut.manifest, manifest_path, key, new_val, 'theme_metadata');

    } else if (third_if_keys.indexOf(family) > -1) {
        write_to_json(shared.mut.manifest, manifest_path, key, new_val, family);

    } else if (family == 'images') {
        write_to_json(shared.mut.manifest, manifest_path, key, new_val + '.' + (img_extension ? img_extension : 'png'), family);

    } else if (family == 'settings') {
        store.set(key, new_val);

        if (key == 'chrome_user_data_dirs') {
            store.set('chrome_process_ids', {});

            open_and_pack.update_chrome_user_data_dirs_observable();
        }
    }

    if (family == 'images' || third_if_keys.indexOf(family) > -1) {
        inputs_data.obj[family][i].default = false;
    }

    if (family == 'tints') {
        const not_disabling = val.some(item => item > -1);

        if (not_disabling) {
            inputs_data.obj[family][i].disable = false;
        }
    }
});

const set_name_or_description_prop = (key, new_val) => {
    const val = shared.mut.manifest[key];
    const val_is_localized = shared.val_is_localized(val);
    const locale = shared.find_from_name(inputs_data.obj.theme_metadata, 'locale').val;
    const messages_path = shared.ob.chosen_folder_path + '\\_locales\\' + locale + '\\messages.json';

    check_if_localisation_folders_exists_create_them_if_dont(locale);

    if (val_is_localized) {
        create_messages_file(messages_path);

        const message_key = shared.get_message_key(val);
        const messages = shared.parse_json(messages_path);

        write_to_json(messages, messages_path, message_key, new_val, 'theme_metadata'); // write to messages.json

    } else {
        create_messages_file(messages_path);
        write_to_json(shared.mut.manifest, shared.ob.chosen_folder_path + '\\manifest.json', key, sta.msg_dict[key], 'theme_metadata'); // set message link (__MSG_name__ or __MSG_description__)

        const messages = shared.parse_json(messages_path);

        write_to_json(messages, messages_path, key, new_val, 'theme_metadata'); // write to messages.json
    }
};

const write_to_json = (json, json_path, key, new_val, family) => {
    if (family == 'theme_metadata') {
        const writing_at_messages = json_path.indexOf('\\messages.json') > -1;

        if (writing_at_messages) {
            json[key] = { message: 'message' }; // ex: { "name": {"message": "Theme name" } }
        }

        writing_at_messages ? json[key].message = new_val : json[key] = new_val; // write to messages.json or manifest.json

    } else {
        if (!json.theme) {
            json.theme = {};
        }

        if (!json.theme[family]) {
            json.theme[family] = {};
        }

        json.theme[family][key] = key == 'ntp_logo_alternate' ? +new_val : new_val;
    }

    const new_json = JSON.stringify(json);

    writeFileSync(json_path, new_json, 'utf8');
};

const check_if_localisation_folders_exists_create_them_if_dont = (locale) => {
    check_if_folder_exists_create_it_if_dont(shared.ob.chosen_folder_path + '\\_locales');
    check_if_folder_exists_create_it_if_dont(shared.ob.chosen_folder_path + '\\_locales\\' + locale);
};

const check_if_folder_exists_create_it_if_dont = (folder_path) => {
    const folder_exists = existsSync(folder_path);

    if (!folder_exists) {
        mkdirSync(folder_path);
    }
};

const create_messages_file = messages_path => {
    const messages_file_exist = existsSync(messages_path);

    if (!messages_file_exist) {
        writeFileSync(messages_path, '{}', 'utf8');
    }
};

//> veariables
const sta = {
    msg_dict: {
        name: '__MSG_name__',
        description: '__MSG_description__',
    }
};
//< veariables