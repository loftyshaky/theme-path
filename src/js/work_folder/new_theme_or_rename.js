'use strict';

import x from 'x';

import * as shared from 'js/shared';
import * as wf_shared from 'js/work_folder/shared';
import * as sort_folders from 'js/work_folder/sort_folders';

import { action, configure } from "mobx";
import * as r from 'ramda';
const path = require('path');
const { existsSync, copySync, renameSync } = require('fs-extra');
const Store = require('electron-store');

const store = new Store();

configure({ enforceActions: 'observed' });

//> create new theme when clicking on "New theme" or rename theme folder when typing in name input
export const create_new_theme_or_rename_theme_folder = action((folder_path, nest_level, i_to_insert_folfder_in, folder_is_opened, name_input_val) => {
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
                    const new_theme_path = path.join(folder_path, folder_name_final);
                    const root_folder_chosen = shared.ob.chosen_folder_path == store.get('work_folder');
                    const number_of_folders = wf_shared.get_number_of_folders_to_work_with(i_to_insert_folfder_in, nest_level) + 1;

                    copySync(source_folder_path, new_theme_path);

                    if (root_folder_chosen || folder_is_opened) {
                        const new_theme = {
                            key: x.unique_id(),
                            name: folder_name_final,
                            path: new_theme_path,
                            children: wf_shared.get_folders(new_theme_path),
                            nest_level: nest_level,
                            is_theme: true,
                            is_empty: false
                        }

                        const folders_with_new_folder = r.insert(i_to_insert_folfder_in, new_theme, wf_shared.ob.folders);

                        wf_shared.ob.folders = sort_folders.sort_folders(folders_with_new_folder, i_to_insert_folfder_in, number_of_folders, nest_level);
                    }

                } else if (mode == 'renaming_folder') {
                    const new_folder_path = path.join(parent_of_renamed_folder_path, folder_name_final);

                    renameSync(source_folder_path, new_folder_path);

                    shared.ob.chosen_folder_path = new_folder_path;

                    const renamed_folder_i = wf_shared.ob.folders.findIndex(item => item.path == source_folder_path);

                    wf_shared.ob.folders[renamed_folder_i].name = folder_name_final;
                    wf_shared.ob.folders[renamed_folder_i].path = new_folder_path;
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

export const rename_theme_folder = x.debounce((folder_path, name_input_val) => create_new_theme_or_rename_theme_folder(folder_path, null, null, null, name_input_val), 250);
//< create new theme when clicking on "New theme" or rename theme folder when typing in name input