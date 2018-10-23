'use strict';


import { observable, configure } from "mobx";
import * as r from 'ramda';
const { readdirSync, statSync } = require('fs-extra');
const { join } = require('path');

configure({ enforceActions: 'observed' });

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

    folder_info.children = get_folders(folder_path);
    folder_info.is_theme = folder_info.children.some(item => item.name == 'manifest.json');
    folder_info.is_empty = !folder_info.children.some(item => statSync(item.path).isDirectory());

    return folder_info;
};

export const get_number_of_folders_to_work_with = (start_i, nest_level) => {
    const close_preceding_folder = r.drop(start_i);
    const get_last_folder_to_close_i = r.findIndex(item => item.nest_level < nest_level || item == ob.folders[ob.folders.length - 1]); // item == wf_shared.ob.folders[wf_shared.ob.folders.length - 1] if last folder
    return r.pipe(close_preceding_folder, get_last_folder_to_close_i)(ob.folders);
};

//> varibles t
export const ob = observable({
    folders: []
});

export const mut = {
    opened_folders: [],
};
//< varibles t