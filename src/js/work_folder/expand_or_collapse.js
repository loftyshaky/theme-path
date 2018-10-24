'use strict';

import x from 'x';

import * as shared from 'js/shared';
import * as wf_shared from 'js/work_folder/shared';
import * as new_theme_or_rename from 'js/work_folder/new_theme_or_rename';
import * as select_folder from 'js/work_folder/select_folder';
import * as sort_folders from 'js/work_folder/sort_folders';
import * as watch from 'js/work_folder/watch';
import * as convert_color from 'js/convert_color';
import { inputs_data, reset_inputs_data } from 'js/inputs_data';

import { observable, action, configure } from "mobx";
import * as r from 'ramda';
const Store = require('electron-store');

const store = new Store();

configure({ enforceActions: 'observed' });

//> on extension load / work_folder folder content change
export const create_top_level_folders = async () => {
    const work_folder = store.get('work_folder');

    if (work_folder) {
        close_all_folders();

        expand_or_collapse_folder('top_level', work_folder, 0, 0);
    }
};

const close_all_folders = action(() => {
    wf_shared.ob.folders.clear();
    wf_shared.mut.opened_folders = [];
});

//< on extension load / work_folder folder content change

export const expand_or_collapse_folder = action((mode, folder_path, nest_level, i_to_insert_folfder_in) => {
    if (mode != 'new_theme' || !select_folder.mut.chosen_folder_info.is_theme) {
        const folder_is_opened = wf_shared.mut.opened_folders.indexOf(folder_path) != - 1;

        if (mode == 'new_theme') {
            new_theme_or_rename.create_new_theme_or_rename_theme_folder(folder_path, nest_level, i_to_insert_folfder_in, folder_is_opened);
        }

        const files = wf_shared.get_folders(folder_path);

        if (!folder_is_opened) {
            expand_folder(folder_path, files, nest_level, i_to_insert_folfder_in);

            watch.watch_folder(folder_path);

        } else if (mode != 'new_theme') { // folder is opened so close it
            const folder_to_remove_start_i = i_to_insert_folfder_in;
            const number_of_folders_to_close = wf_shared.get_number_of_folders_to_work_with(i_to_insert_folfder_in, nest_level); //>1 get number of folders to close
            const stop_folder_i = folder_to_remove_start_i + number_of_folders_to_close;
            const stop_folder_is_not_last_folder = wf_shared.ob.folders[stop_folder_i + 1];
            const folder_to_close_end_i = stop_folder_is_not_last_folder ? stop_folder_i - 1 : stop_folder_i;

            //>1 close folders
            const set_opened_folders_to_null = x.map_i((item, i) => {
                const folder_is_eligible_for_deletion = i >= folder_to_remove_start_i && i <= folder_to_close_end_i && wf_shared.ob.folders[i].nest_level == nest_level;

                if (folder_is_eligible_for_deletion) {
                    //>2 mark target's child folders as closed
                    const opened_folder_i = wf_shared.mut.opened_folders.indexOf(item.path);

                    if (opened_folder_i > - 1) {
                        wf_shared.mut.opened_folders.splice(wf_shared.mut.opened_folders.indexOf(item.path), 1);
                    }
                    //<2 mark target folder's child folders as closed

                    return null;

                } else {
                    return item;
                }
            });
            const close_nulled = r.filter(item => item);

            wf_shared.mut.opened_folders.splice(wf_shared.mut.opened_folders.indexOf(folder_path), 1); // mark target folder as closed
            wf_shared.ob.folders = r.pipe(set_opened_folders_to_null, close_nulled)(wf_shared.ob.folders);
            //<1 close folders
        }
    }
});

const expand_folder = (folder_path, files, nest_level, i_to_insert_folfder_in) => {
    let expanded_folders = [];

    for (const file of files) {
        if (file.is_directory) {
            const folder_info = wf_shared.get_info_about_folder(file.path);

            const expanded_folder = {
                key: x.unique_id(),
                name: file.name,
                path: file.path,
                children: folder_info.children,
                nest_level: nest_level,
                is_theme: folder_info.is_theme,
                is_empty: folder_info.is_empty
            }

            expanded_folders.push(expanded_folder);
        }
    }

    const is_theme = files.some(item => item.name == 'manifest.json');

    if (!is_theme) {
        const is_root = folder_path == '';

        if (!is_root) {
            wf_shared.mut.opened_folders.push(folder_path);  // mark target folder as opened
        }

        const folders_with_new_folder = r.insertAll(i_to_insert_folfder_in, expanded_folders, wf_shared.ob.folders);

        wf_shared.ob.folders = sort_folders.sort_folders(folders_with_new_folder, i_to_insert_folfder_in, expanded_folders.length, nest_level);
    }
};

create_top_level_folders();