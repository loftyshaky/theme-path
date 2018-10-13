'use strict';

import x from 'x';

import * as shared from 'js/shared';
import { inputs_data, reset_inputs_data } from 'js/inputs_data';

import { observable, action, configure } from "mobx";
import * as r from 'ramda';
//import * as dir_tree from "directory-tree";
const { readdirSync, statSync, readFileSync } = require('fs')
const { join } = require('path')
const Store = require('electron-store');

const store = new Store();

configure({ enforceActions: 'observed' });

const get_folders = path => {
    const files = readdirSync(path);

    return files.map(file => {
        const child_path = path + '/' + file;
        return {
            name: file,
            path: child_path,
            is_directory: statSync(join(path, file)).isDirectory()
        }
    })
}

//> on extension load / work_folder folder content change
export const create_top_level_folders = async () => {
    const work_folder = store.get('work_folder');

    if (work_folder) {
        close_all_folders();

        const files = get_folders(store.get('work_folder'));

        expand_folder('', files, 0, 0);
    }
};
//< on extension load / work_folder folder content change

//> expand folder when clicking on folder
export const expand_folder = action((path, files, nest_level, index_to_insert_folfder_in) => {
    const folder_is_not_opened = mut.opened_folders.indexOf(path) == - 1;
    let expanded_folders = [];

    if (folder_is_not_opened) {
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
            const is_root = path == '';

            if (!is_root) {
                mut.opened_folders.push(path);  // mark target folder as opened
            }

            ob.folders = r.insertAll(index_to_insert_folfder_in, expanded_folders, ob.folders);
        }

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

        mut.opened_folders.splice(mut.opened_folders.indexOf(path), 1); // mark target folder as closed
        ob.folders = r.pipe(set_opened_folders_to_null, close_nulled)(ob.folders);
        //<1 close folders
    }
});
//< expand folder when clicking on folder

//> select folder and fill inputs with theme data
export const select_folder = action(async (path, children) => {
    const folder_is_theme = children.find(file => file.name == 'manifest.json');

    if (folder_is_theme) {
        reset_inputs_data();

        shared.mut.manifest = JSON.parse(readFileSync(path + '/manifest.json', 'utf8').trim());
        const default_locale = shared.mut.manifest.default_locale;

        for (const [name, val] of Object.entries(shared.mut.manifest)) {
            const item = shared.find_from_name(inputs_data.obj.theme_metadata, name);

            if (item) {
                const val_is_localized = val.indexOf('__MSG_') > -1;

                if (val_is_localized) {
                    const message_key = val.replace(/__MSG_|__/g, '');
                    get_theme_name_or_descrption(name, message_key, default_locale, path);

                } else {
                    set_val('theme_metadata', name, val);
                }
            }
        }

        set_val('theme_metadata', 'locale', default_locale);

        for (const [main_key, main_val] of Object.entries(shared.mut.manifest.theme)) {
            for (const [key, val] of Object.entries(main_val)) {
                set_val(main_key, key, val);
            }
        }
    }

    shared.ob.chosen_folder_path = path;
});

const get_theme_name_or_descrption = (name, message_key, default_locale, path) => {
    const val = JSON.parse(readFileSync(path + '/_locales/' + default_locale + '/messages.json', 'utf8').trim())[message_key].message;

    set_val('theme_metadata', name, val)
};

const set_val = (main_key, key, val) => {
    const item = shared.find_from_name(inputs_data.obj[main_key], key);

    if (item) {
        item.val = val;
    }
};
//< select folder and fill inputs with theme data

const close_all_folders = action(() => {
    ob.folders.clear();
    mut.opened_folders = [];
});

export const show_or_hide_choose_work_folder_btn = action((scroll_info) => {
    ob.show_work_folder_selector = scroll_info.scrollTop == 0 ? true : false
});

//> varibles t
export const mut = {
    opened_folders: []
};

export const ob = observable({
    folders: [],
    show_work_folder_selector: true
});
//< varibles t

create_top_level_folders();