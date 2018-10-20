'use strict';

import x from 'x';

import * as shared from 'js/shared';
import * as convert_color from 'js/convert_color';
import { inputs_data, reset_inputs_data } from 'js/inputs_data';

import { observable, action, configure } from "mobx";
import * as r from 'ramda';
const path = require('path');
const { existsSync, readdirSync, statSync, copySync, renameSync } = require('fs-extra');
const { join } = require('path');
const Store = require('electron-store');

const store = new Store();

configure({ enforceActions: 'observed' });

const get_folders = folder_path => {
    const files = readdirSync(folder_path);

    return files.map(file => {
        const child_path = folder_path + '\\' + file;

        return {
            name: file,
            path: child_path,
            is_directory: statSync(join(folder_path, file)).isDirectory()
        }
    })
}

//> on extension load / work_folder folder content change
export const create_top_level_folders = async () => {
    const work_folder = store.get('work_folder');

    if (work_folder) {
        close_all_folders();

        expand_or_collapse_folder('top_level', work_folder, 0, 0);
    }
};
//< on extension load / work_folder folder content change

export const expand_or_collapse_folder = action((mode, folder_path, nest_level, index_to_insert_folfder_in) => {
    if (mode != 'new_theme' || !mut.selected_folder_info.is_theme) {
        const folder_is_not_opened = mut.opened_folders.indexOf(folder_path) == - 1;

        if (mode == 'new_theme') {
            create_new_theme_or_rename_theme_folder(folder_path);
        }

        const files = get_folders(folder_path);

        if (folder_is_not_opened) {
            expand_folder(folder_path, files, nest_level, index_to_insert_folfder_in);

        } else { // folder is opened so close it
            const folder_to_remove_start_i = index_to_insert_folfder_in;

            //>1 get number of folders to close
            const close_preceding_folder = r.drop(folder_to_remove_start_i);
            const get_last_folder_to_close_i = r.findIndex(item => item.nest_level < nest_level || item == ob.folders[ob.folders.length - 1]); // item == ob.folders[ob.folders.length - 1] if last folder
            const number_of_folders_to_close = r.pipe(close_preceding_folder, get_last_folder_to_close_i)(ob.folders);
            //<1 get number of folders to close 

            const stop_folder_i = folder_to_remove_start_i + number_of_folders_to_close;
            const stop_folder_is_not_last_folder = ob.folders[stop_folder_i + 1];
            const folder_to_close_end_i = stop_folder_is_not_last_folder ? stop_folder_i - 1 : stop_folder_i;

            //>1 close folders
            const set_opened_folders_to_null = x.map_i((item, i) => {
                const folder_is_eligible_for_deletion = i >= folder_to_remove_start_i && i <= folder_to_close_end_i;

                if (folder_is_eligible_for_deletion) {
                    //>2 mark target's child folders as closed
                    const opened_folder_i = mut.opened_folders.indexOf(item.path);

                    if (opened_folder_i > - 1) {
                        mut.opened_folders.splice(mut.opened_folders.indexOf(item.path), 1);
                    }
                    //<2 mark target folder's child folders as closed

                    return null;

                } else {
                    return item;
                }
            });
            const close_nulled = r.filter(item => item);

            mut.opened_folders.splice(mut.opened_folders.indexOf(folder_path), 1); // mark target folder as closed
            ob.folders = r.pipe(set_opened_folders_to_null, close_nulled)(ob.folders);
            //<1 close folders

            if (mode == 'new_theme') {
                expand_folder(folder_path, files, nest_level, index_to_insert_folfder_in);
            }
        }
    }
});

const expand_folder = (folder_path, files, nest_level, index_to_insert_folfder_in) => {
    let expanded_folders = [];

    for (const file of files) {
        if (file.is_directory) {
            const children = get_folders(file.path);
            const is_theme = children.some(item => item.name == 'manifest.json');
            const is_empty = !children.some(item => statSync(item.path).isDirectory());

            const expanded_folder = {
                key: x.unique_id(),
                name: file.name,
                path: file.path,
                children: children,
                nest_level: nest_level,
                is_theme: is_theme,
                is_empty: is_empty
            }

            expanded_folders.push(expanded_folder);
        }
    }

    const is_theme = files.some(item => item.name == 'manifest.json');

    if (!is_theme) {
        const is_root = folder_path == '';

        if (!is_root) {
            mut.opened_folders.push(folder_path);  // mark target folder as opened
        }

        ob.folders = r.insertAll(index_to_insert_folfder_in, expanded_folders, ob.folders);
    }
};


//> select folder and fill inputs with theme data
export const select_folder = action((folder_path, children, nest_level, index_to_insert_folfder_in) => {
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

    mut.selected_folder_info = {
        path: folder_path,
        children: children,
        is_theme: folder_is_theme,
        nest_level: nest_level,
        index_to_insert_folfder_in: index_to_insert_folfder_in
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
//> create new theme when clicking on "New theme" or rename theme folder when typing in name input
export const create_new_theme_or_rename_theme_folder = action((folder_path, name_input_val) => {
    const mode = name_input_val ? 'renaming_folder' : 'creating_folder';
    const folder_name = mode == 'renaming_folder' ? name_input_val : x.message('new_theme_btn_label_text');
    const timne_id = Date.now();
    const source_folder_path = mode == 'renaming_folder' ? folder_path : path.resolve('resources', 'app', 'dist', 'new_theme');
    const parent_of_renamed_folder_path = path.dirname(folder_path);

    for (let i = 0; i < 22; i++) {
        const unique_identifier = i < 21 ? i : timne_id;
        const folder_name_final = folder_name + (i != 0 ? ' (' + unique_identifier + ')' : '');

        try {
            if (!existsSync(path.join(folder_path, folder_name_final))) {
                if (mode == 'creating_folder') {
                    copySync(source_folder_path, path.join(folder_path, folder_name_final));

                } else if (mode == 'renaming_folder') {
                    const new_folder_path = path.join(parent_of_renamed_folder_path, folder_name_final);

                    renameSync(source_folder_path, new_folder_path);

                    shared.ob.chosen_folder_path = new_folder_path;

                    const renamed_folder_i = ob.folders.findIndex(item => item.path == source_folder_path);

                    ob.folders[renamed_folder_i].name = folder_name_final;
                    ob.folders[renamed_folder_i].path = new_folder_path;
                }

            } else {
                throw 'found folder with the same name';
            }

            break;

        } catch (er) {
            console.error(er);
        }
    }
});

export const rename_theme_folder = x.debounce((folder_path, name_input_val) => create_new_theme_or_rename_theme_folder(folder_path, name_input_val));
//< create new theme when clicking on "New theme" or rename theme folder when typing in name input

const close_all_folders = action(() => {
    ob.folders.clear();
    mut.opened_folders = [];
});

export const show_or_hide_choose_work_folder_btn = action((scroll_info) => {
    ob.show_work_folder_selector = scroll_info.scrollTop == 0 ? true : false
});

//> varibles t
export const mut = {
    opened_folders: [],
    selected_folder_info: {}
};

export const ob = observable({
    folders: [],
    show_work_folder_selector: true
});
//< varibles t

create_top_level_folders();