'use_strict';

import { inputs_data } from 'js/inputs_data';
import * as shared from 'js/shared';
import * as new_theme_or_rename from 'js/work_folder/new_theme_or_rename';
import * as select_folder from 'js/work_folder/select_folder';
import * as settings from 'js/settings'
import * as open_and_pack from 'js/open_and_pack';

import { join, sep } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs-extra';

import { action, configure } from 'mobx';
import Store from 'electron-store';

const store = new Store();
configure({ enforceActions: 'observed' });

//--

export const change_val = (family, i, val, img_extension, e) => {
    const new_val = val == 'is_not_select' ? e.target.value : val;
    const name = inputs_data.obj[family][i].name;
    const manifest_path = join(shared.ob.chosen_folder_path, 'manifest.json');
    const default_locale = family == 'theme_metadata' ? shared.find_from_name(inputs_data.obj[family], 'default_locale').val : null;
    const first_if_names = ['name', 'description'];
    const second_if_names = ['version', 'default_locale'];
    const third_if_names = ['colors', 'tints', 'properties'];

    set_inputs_data_val(family, i, new_val);

    if (first_if_names.indexOf(name) > -1) {
        set_name_or_description_prop(name, e.target.value);

        if (name === 'name') {
            const locale = shared.find_from_name(inputs_data.obj[family], 'locale').val;

            if (locale == default_locale) {
                new_theme_or_rename.rename_theme_folder(shared.ob.chosen_folder_path, new_val);

                shared.set_default_locale_theme_name(name, new_val);
            }
        }

    } else if (second_if_names.indexOf(name) > -1) {
        write_to_json(shared.mut.manifest, manifest_path, name, new_val, 'theme_metadata');

    } else if (name == 'locale') {
        select_folder.get_theme_name_or_descrption_inner(shared.ob.chosen_folder_path, new_val, default_locale);

    } else if (third_if_names.indexOf(family) > -1) {
        write_to_json(shared.mut.manifest, manifest_path, name, new_val, family);

    } else if (family == 'images' || name == 'icon') {
        write_to_json(shared.mut.manifest, manifest_path, name, new_val + '.' + (img_extension ? img_extension : 'png'), family);

    } else if (family == 'settings') {
        store.set(name, new_val);

        if (name == 'chrome_user_data_dirs') {
            store.set('chrome_process_ids', {});

            open_and_pack.update_chrome_user_data_dirs_observable();

        } else if (name == 'theme') {
            settings.load_theme();
        }
    }

    if (family == 'images' || third_if_names.indexOf(family) > -1 || name == 'icon') {
        set_default_bool(family, i, false);
    }

    if (family == 'tints') {
        const not_disabling = val.some(item => item > -1);

        if (not_disabling) {
            set_disable_bool(family, i, false);
        }
    }
};

const set_name_or_description_prop = (name, new_val) => {
    const val = shared.mut.manifest[name];
    const val_is_localized = shared.val_is_localized(val);
    const locale = shared.find_from_name(inputs_data.obj.theme_metadata, 'locale').val;
    const messages_path = join(shared.ob.chosen_folder_path, '_locales', locale, 'messages.json');

    check_if_localisation_folders_exists_create_them_if_dont(locale);

    if (val_is_localized) {
        create_messages_file(messages_path);

        const message_name = shared.get_message_name(val);
        const messages = shared.parse_json(messages_path);

        write_to_json(messages, messages_path, message_name, new_val, 'theme_metadata'); // write to messages.json

    } else {
        create_messages_file(messages_path);
        write_to_json(shared.mut.manifest, join(shared.ob.chosen_folder_path, 'manifest.json'), name, sta.msg_dict[name], 'theme_metadata'); // set message link (__MSG_name__ or __MSG_description__)

        const messages = shared.parse_json(messages_path);

        write_to_json(messages, messages_path, name, new_val, 'theme_metadata'); // write to messages.json
    }
};

const write_to_json = (json, json_path, name, new_val, family) => {
    if (family == 'theme_metadata') {
        if (name !== 'icon') {
            const writing_at_messages = json_path.indexOf(sep + 'messages.json') > -1;

            if (writing_at_messages) {
                json[name] = { message: 'message' }; // ex: { "name": {"message": "Theme name" } }
            }

            writing_at_messages ? json[name].message = new_val : json[name] = new_val; // write to messages.json or manifest.json

        } else if (name == 'icon') {
            shared.construct_icons_obj(json);

            json.icons['128'] = new_val;
        }

    } else {
        if (!json.theme) {
            json.theme = {};
        }

        if (!json.theme[family]) {
            json.theme[family] = {};
        }

        json.theme[family][name] = name == 'ntp_logo_alternate' ? +new_val : new_val;
    }

    shared.write_to_json(json, json_path);
};

const check_if_localisation_folders_exists_create_them_if_dont = (locale) => {
    check_if_folder_exists_create_it_if_dont(join(shared.ob.chosen_folder_path, '_locales'));
    check_if_folder_exists_create_it_if_dont(join(shared.ob.chosen_folder_path, '_locales', locale));
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

export const set_inputs_data_val = action((family, i, val) => {
    inputs_data.obj[family][i].val = val;
});

export const set_inputs_data_color = action((family, i, color) => {
    inputs_data.obj[family][i].color = color;
});

export const set_default_bool = action((family, i, bool) => {
    inputs_data.obj[family][i].default = bool;
});

export const set_disable_bool = action((family, i, bool) => {
    inputs_data.obj[family][i].disable = bool;
});


//> veariables
const sta = {
    msg_dict: {
        name: '__MSG_name__',
        description: '__MSG_description__',
    }
};
//< veariables