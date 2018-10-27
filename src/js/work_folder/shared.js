'use strict';

import * as shared from 'js/shared';

import { observable, configure } from "mobx";
import * as r from 'ramda';
const { existsSync, readdirSync, statSync } = require('fs-extra');
const { join } = require('path');
const Store = require('electron-store');

const store = new Store();

configure({ enforceActions: 'observed' });

export const rerender_work_folder = () => {
    const previous_val = shared.ob.chosen_folder_path;;
    shared.ob.chosen_folder_path = '';
    shared.ob.chosen_folder_path = previous_val;
};

export const get_folders = folder_path => {
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


export const get_info_about_folder = (folder_path) => {
    const folder_info = {};

    if (!existsSync(folder_path)) {
        folder_info.is_theme = false;
        folder_info.is_empty = true

    } else {
        folder_info.children = get_folders(folder_path);
        folder_info.is_theme = folder_info.children.some(item => item.name == 'manifest.json');
        folder_info.is_empty = !folder_info.children.some(item => statSync(item.path).isDirectory());
    }

    return folder_info;
};

export const get_number_of_folders_to_work_with = (start_i, nest_level) => {
    const close_preceding_folder = r.drop(start_i);
    const get_last_folder_to_close_i = r.findIndex(item => item.nest_level < nest_level || item == ob.folders[ob.folders.length - 1]); // item == wf_shared.ob.folders[wf_shared.ob.folders.length - 1] if last folder
    return r.pipe(close_preceding_folder, get_last_folder_to_close_i)(ob.folders);
};

//> varibles t
export const ob = observable({
    folders: [],
    get fieldset_protecting_screen_is_visible() {
        return shared.ob.chosen_folder_path == store.get('work_folder') || !mut.chosen_folder_info.is_theme;
    }
});

export const mut = {
    opened_folders: [],
    chosen_folder_info: {},
};
//< varibles t