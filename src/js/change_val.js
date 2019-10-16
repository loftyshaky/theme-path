'use_strict';

import { join, sep } from 'path';
import { existsSync, mkdirSync, removeSync, readdirSync } from 'fs-extra';

import { action, configure } from 'mobx';
import * as r from 'ramda';
import Store from 'electron-store';

import x from 'x';
import { inputs_data } from 'js/inputs_data';
import * as manifest from 'js/manifest';
import * as chosen_folder_path from 'js/chosen_folder_path';
import * as icons from 'js/icons';
import * as msg from 'js/msg';
import * as json_file from 'js/json_file';
import * as options from 'js/options';
import * as open_and_pack from 'js/open_and_pack';
import * as convert_color from 'js/convert_color';
import * as custom_folders from 'js/work_folder/custom_folders';
import * as tutorial from 'js/tutorial';
import * as history from 'js/history';
import * as select_folder from 'js/work_folder/select_folder';
import * as choose_folder from 'js/work_folder/choose_folder';

const { getCurrentWindow } = require('electron').remote;

const store = new Store();
configure({ enforceActions: 'observed' });

export const change_val = async (family, name, new_val, img_extension, reload_manifest, remove_reverted_history, target_folder_path, forced_locale, forced_default_locale) => {
    try {
        const theme_families = ['theme_metadata', 'images', 'colors', 'tints', 'properties'];

        if (theme_families.indexOf(family) === -1 || choose_folder.reset_work_folder(true)) {
            if (remove_reverted_history && name !== 'locale') {
                history.remove_reverted_history();
            }

            const bulk_copying = target_folder_path;
            const manifest_path = join(target_folder_path || chosen_folder_path.ob.chosen_folder_path, 'manifest.json');
            let manifest_obj;
            if (reload_manifest) {
                manifest.reload_manifest();
                manifest_obj = manifest.mut.manifest;

            } else if (bulk_copying) {
                manifest_obj = json_file.parse_json(manifest_path);

            } else {
                manifest_obj = manifest.mut.manifest;
            }

            const default_locale = family === 'theme_metadata' ? inputs_data.obj[family].default_locale.val : null;
            const first_if_strings = ['name', 'description'];
            const second_if_strings = ['version', 'default_locale'];
            const third_if_strings = ['colors', 'tints', 'properties'];
            const fourth_if_strings = ['images', 'icon'];
            const five_if_strings = ['video_volume', 'size'];
            const img_extension_final = `${img_extension || '.png'}`;

            if (name !== 'clear_new_tab_video' && reload_manifest) {
                set_inputs_data_val(family, name, fourth_if_strings.indexOf(family) > -1 ? new_val + img_extension_final : new_val);
            }

            if (first_if_strings.indexOf(name) > -1) {
                update_name_or_description(name, new_val, forced_locale, forced_default_locale, reload_manifest ? null : manifest_obj, target_folder_path);

            } else if (second_if_strings.indexOf(name) > -1) {
                write_to_json(manifest_obj, manifest_path, name, new_val, 'theme_metadata');

                if (name === 'default_locale') {
                    add_locale_folder(new_val);
                    delete_unused_locale_folders(new_val);
                }

            } else if (name === 'locale') {
                select_folder.get_theme_name_or_descrption_inner(chosen_folder_path.ob.chosen_folder_path, new_val, default_locale);

            } else if (third_if_strings.indexOf(family) > -1 || five_if_strings.indexOf(name) > -1) {
                write_to_json(manifest_obj, manifest_path, name, new_val, family);
                set_inputs_data_val(family, name, new_val);

            } else if (family === 'images' || name === 'icon') {
                write_to_json(manifest_obj, manifest_path, name, new_val + img_extension_final, family);

                const created_solid_color_background_img = !img_extension && name === 'theme_ntp_background';

                if (created_solid_color_background_img) {
                    set_inputs_data_val('properties', 'ntp_background_repeat', 'repeat');
                    write_to_json(manifest_obj, manifest_path, 'ntp_background_repeat', 'repeat', 'properties');
                }

            } else if (family === 'options') {
                store.set(name, new_val);

                if (name === 'chrome_user_data_folders') {
                    open_and_pack.update_chrome_user_data_folders_observable();

                } else if (name === 'chrome_exe_paths') {
                    open_and_pack.update_chrome_exe_paths_observable();

                } else if (name === 'custom_folders') {
                    custom_folders.update_custom_folders_observable();

                } else if (name === 'theme') {
                    x.load_css('no_tr');

                    options.load_theme();
                    convert_color.convert_all();

                    await x.delay(200);

                    x.remove(s('.no_tr'));
                }
            }

            if (family === 'images' || third_if_strings.indexOf(family) > -1 || name === 'icon' || name === 'clear_new_tab_video') {
                set_default_bool(family, name, false);
            }

            if (family === 'tints') {
                const not_disabling = new_val.some(item => item > -1);

                if (not_disabling) {
                    set_disabled_bool(family, name, false);
                }
            }

            if (name === 'language' || name === 'color_picker_default_mode') {
                getCurrentWindow().reload();
            }
        }

    } catch (er) {
        err(er, 21);
    }
};

export const update_name_or_description = (name, new_val, forced_locale, forced_default_locale, mainfest_obj, target_folder_path) => {
    try {
        set_name_or_description(name, new_val, forced_locale, mainfest_obj, target_folder_path);

        const locale = forced_locale || inputs_data.obj.theme_metadata.locale.val;
        const default_locale = forced_default_locale || inputs_data.obj.theme_metadata.default_locale.val;

        delete_locale_folder(locale, default_locale);

    } catch (er) {
        err(er, 229);
    }
};

const set_name_or_description = (name, new_val, forced_locale, mainfest_obj, target_folder_path) => {
    try {
        const mainfest_obj_final = mainfest_obj || manifest.mut.manifest;
        const val = mainfest_obj_final[name];
        const val_is_localized = msg.val_is_localized(val);
        const locale = forced_locale || inputs_data.obj.theme_metadata.locale.val;
        const messages_path = get_messages_path(locale, target_folder_path);

        check_if_localisation_folders_exists_create_them_if_dont(locale);

        if (val_is_localized) {
            json_file.create_json_file(messages_path, '{}');

            const message_name = msg.get_message_name(val);
            const messages = json_file.parse_json(messages_path);

            write_to_json(messages, messages_path, message_name, new_val, 'theme_metadata'); // write to messages.json

        } else {
            json_file.create_json_file(messages_path, '{}');
            write_to_json(mainfest_obj_final, join(chosen_folder_path.ob.chosen_folder_path, 'manifest.json'), name, sta.msg_dict[name], 'theme_metadata'); // set message link (__MSG_name__ or __MSG_description__)

            const messages = json_file.parse_json(messages_path);

            write_to_json(messages, messages_path, name, new_val, 'theme_metadata'); // write to messages.json
        }

    } catch (er) {
        err(er, 22);
    }
};

const write_to_json = (json, json_path, name, new_val, family) => {
    try {
        const new_json = json;

        if (family === 'theme_metadata') {
            if (name !== 'icon') {
                const writing_at_messages = json_path.indexOf(`${sep}messages.json`) > -1;

                if (writing_at_messages) {
                    new_json[name] = { message: 'message' }; // ex: { "name": {"message": "Theme name" } }
                }

                //> write to messages.json or manifest.json
                if (writing_at_messages) {
                    new_json[name].message = new_val;

                } else {
                    new_json[name] = new_val;
                }
                //< write to messages.json or manifest.json

            } else if (name === 'icon') {
                icons.construct_icons_obj(json);

                new_json.icons['128'] = new_val;
            }

        } else {
            if (!json.theme) {
                new_json.theme = {};
            }

            if (!json.theme[family]) {
                new_json.theme[family] = {};
            }

            new_json.theme[family][name] = name === 'ntp_logo_alternate' ? +new_val : new_val;
        }

        json_file.write_to_json(new_json, json_path);

        if (family !== 'theme_metadata' && tutorial.ob.tutorial_stage === 5) {
            tutorial.increment_tutorial_stage(false, true);
        }

    } catch (er) {
        err(er, 23);
    }
};

const check_if_localisation_folders_exists_create_them_if_dont = locale => {
    try {
        check_if_folder_exists_create_it_if_dont(join(chosen_folder_path.ob.chosen_folder_path, '_locales'));
        check_if_folder_exists_create_it_if_dont(join(chosen_folder_path.ob.chosen_folder_path, '_locales', locale));

    } catch (er) {
        err(er, 24);
    }
};

const check_if_folder_exists_create_it_if_dont = folder_path => {
    try {
        const folder_exists = existsSync(folder_path);

        if (!folder_exists) {
            mkdirSync(folder_path);
        }

    } catch (er) {
        err(er, 25);
    }
};

//> delete locale folder when both name and description is ''
const delete_locale_folder = async (locale, default_locale, target_folder_path) => {
    try {
        const name = inputs_data.obj.theme_metadata.name.val;
        const description = inputs_data.obj.theme_metadata.description.val;

        if (name === '' && description === '' && locale !== default_locale) {
            try {
                removeSync(join(target_folder_path || chosen_folder_path.ob.chosen_folder_path, '_locales', locale));

            } catch (er) {
                err(er, 123, 'locale_is_locked');
            }
        }

    } catch (er) {
        err(er, 122);
    }
};
//< delete locale folder when both name and description is ''

//> delete locale folders with empty name and description
const delete_unused_locale_folders = new_default_locale => {
    try {
        const locale_folders = readdirSync(join(chosen_folder_path.ob.chosen_folder_path, '_locales'));

        locale_folders.forEach(locale_folder => {
            if (locale_folder !== new_default_locale) {
                const messages_path = get_messages_path(locale_folder);

                const remove_locale_folder = r.ifElse(
                    () => existsSync(messages_path),
                    () => {
                        const messages_json = json_file.parse_json(messages_path);

                        const name_exist = check_if_name_or_description_exist('name', messages_json);
                        const description_exist = check_if_name_or_description_exist('name', messages_json);

                        if (!name_exist && !description_exist) {
                            return true;
                        }

                        return false;
                    },
                    () => true,
                )();

                if (remove_locale_folder) {
                    try {
                        removeSync(join(chosen_folder_path.ob.chosen_folder_path, '_locales', locale_folder));

                    } catch (er) {
                        err(er, 131, 'folder_is_locked');
                    }
                }
            }
        });

    } catch (er) {
        err(er, 130);
    }
};
//< delete locale folders with empty name and description

const check_if_name_or_description_exist = (name, message_json) => {
    try {
        const val = manifest.mut.manifest[name];
        const val_is_localized = msg.val_is_localized(val);

        if (val_is_localized) {
            const message_name = msg.get_message_name(val);
            if (!message_json) {
                return false;
            }

            if (!message_json[message_name]) {
                return false;

            }

            if (!message_json[message_name].message) {
                return false;

            }

            if (message_json[message_name].message === '') {
                return false;
            }

            return true;
        }

        return false;

    } catch (er) {
        err(er, 132);

        return false;
    }
};

const add_locale_folder = new_default_locale => {
    try {
        const messages_path = get_messages_path(new_default_locale);
        const messages_json = json_file.parse_json(messages_path);

        if (!messages_json || (messages_json && !messages_json.name && !messages_json.description)) {
            set_name_or_description('name', '', new_default_locale);
            set_name_or_description('description', '', new_default_locale);
        }

    } catch (er) {
        err(er, 129, 'folder_is_locked');
    }
};

export const set_inputs_data_val = action((family, name, val) => {
    try {
        inputs_data.obj[family][name].val = val;

    } catch (er) {
        err(er, 27);
    }
});

export const set_previous_val = (family, name, val) => {
    try {
        inputs_data.obj[family][name].previous_val = val;

    } catch (er) {
        err(er, 226);
    }
};

export const set_inputs_data_color = action((family, name, color) => {
    try {
        inputs_data.obj[family][name].color = color;

    } catch (er) {
        err(er, 28);
    }
});

export const set_default_bool = action((family, name, bool) => {
    try {
        inputs_data.obj[family][name].default = bool;

    } catch (er) {
        err(er, 29);
    }
});

export const set_disabled_bool = action((family, name, bool) => {
    try {
        inputs_data.obj[family][name].disabled = bool;

    } catch (er) {
        err(er, 30);
    }
});

const get_messages_path = (locale, target_folder_path) => {
    try {
        return join(target_folder_path || chosen_folder_path.ob.chosen_folder_path, '_locales', locale, 'messages.json');

    } catch (er) {
        err(er, 193);
    }

    return undefined;
};

const sta = {
    msg_dict: {
        name: '__MSG_name__',
        description: '__MSG_description__',
    },
};
