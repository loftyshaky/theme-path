import { action, configure } from 'mobx';
import * as r from 'ramda';

import x from 'x';
import * as chosen_folder_path from 'js/chosen_folder_path';
import * as folders from 'js/work_folder/folders';
import * as new_theme_or_rename from 'js/work_folder/new_theme_or_rename';
import * as expand_or_collapse from 'js/work_folder/expand_or_collapse';
import * as sort_folders from 'js/work_folder/sort_folders';
import * as watch from 'js/work_folder/watch';
import * as choose_folder from 'js/work_folder/choose_folder';

configure({ enforceActions: 'observed' });

//> on extension load / work_folder folder content change
export const create_top_level_folders = async () => {
    try {
        const { work_folder } = choose_folder.ob;

        if (work_folder) {
            collapse_all_folders();

            expand_or_collapse_folder('top_level', work_folder, 0, 0);
        }

    } catch (er) {
        err(er, 73);
    }
};

export const collapse_all_folders = action(() => {
    try {
        folders.ob.folders.clear();
        folders.mut.opened_folders = [];

    } catch (er) {
        err(er, 74);
    }
});
//< on extension load / work_folder folder content change

export const expand_or_collapse_folder = (mode, folder_path, nest_level, i_to_insert_folder_in, custom_folder_path) => {
    try {
        if (choose_folder.reset_work_folder(false) && (mode !== 'new_theme' || !folders.mut.chosen_folder_info.is_theme)) {
            const folder_is_opened = folders.mut.opened_folders.indexOf(folder_path) !== -1;

            if (mode === 'new_theme') {
                new_theme_or_rename.create_new_theme_or_rename_theme_folder('creating_folder', folder_path, nest_level, i_to_insert_folder_in, folder_is_opened, null, custom_folder_path);
            }

            const files = folders.get_folders(folder_path);

            if (!folder_is_opened) {
                expand_folder(folder_path, files, nest_level, i_to_insert_folder_in);

                watch.watch_folder(folder_path);

            } else if (mode !== 'new_theme') { // folder is opened so close it
                const folder_to_remove_start_i = i_to_insert_folder_in;
                const number_of_folders_to_close = folders.get_number_of_folders_to_work_with(i_to_insert_folder_in, nest_level); //>1 get number of folders to close
                const stop_folder_i = folder_to_remove_start_i + number_of_folders_to_close;
                const stop_folder_is_not_last_folder = folders.ob.folders[stop_folder_i + 1];
                const folder_to_close_end_i = stop_folder_is_not_last_folder ? stop_folder_i - 1 : stop_folder_i;

                //>1 close folders
                const set_opened_folders_to_null = x.map_i((item, i) => {
                    const folder_is_eligible_for_deletion = i >= folder_to_remove_start_i
                        && i <= folder_to_close_end_i
                        && folders.ob.folders[i].nest_level >= nest_level;

                    if (folder_is_eligible_for_deletion) {
                        //>2 mark target's child folders as closed
                        const opened_folder_i = folders.mut.opened_folders.indexOf(item.path);

                        if (opened_folder_i > -1) {
                            folders.mut.opened_folders.splice(opened_folder_i, 1);
                        }
                        //<2 mark target folder's child folders as closed

                        if (item.path === chosen_folder_path.ob.chosen_folder_path) {
                            folders.deselect_theme();
                        }

                        return null;
                    }

                    return item;
                });

                const close_nulled = r.filter(item => item);

                folders.mut.opened_folders.splice(folders.mut.opened_folders.indexOf(folder_path), 1); // mark target folder as closed

                folders.set_folders(r.pipe(set_opened_folders_to_null, close_nulled)(folders.ob.folders));
                //<1 close folders
            }
        }

    } catch (er) {
        err(er, 75);
    }
};

const expand_folder = (folder_path, files, nest_level, i_to_insert_folder_in) => {
    try {
        const expanded_folders = [];

        files.forEach(file => {
            if (file.is_directory) {
                const folder_info = folders.get_info_about_folder(file.path);

                const expanded_folder = {
                    key: x.unique_id(),
                    name: file.name,
                    path: file.path,
                    children: folder_info.children,
                    nest_level,
                    is_theme: folder_info.is_theme,
                    is_empty: folder_info.is_empty,
                };

                expanded_folders.push(expanded_folder);
            }
        });

        const is_theme = files.some(item => item.name === 'manifest.json');

        if (!is_theme) {
            const is_root = folder_path === '';

            if (!is_root) {
                folders.mut.opened_folders.push(folder_path); // mark target folder as opened
            }

            append_expanded(i_to_insert_folder_in, expanded_folders);

            new_theme_or_rename.put_new_folder_first(folder_path);
        }

    } catch (er) {
        err(er, 76);
    }
};

export const create_new_theme_or_folder = async custom_folder_path => {
    try {
        const root_folder_chosen = chosen_folder_path.ob.chosen_folder_path === choose_folder.ob.work_folder;

        if (root_folder_chosen) {
            new_theme_or_rename.create_new_theme_or_rename_theme_folder(
                'creating_folder',
                chosen_folder_path.ob.chosen_folder_path,
                0,
                0,
                true,
                null,
                custom_folder_path,
            );

        } else {
            expand_or_collapse.expand_or_collapse_folder(
                'new_theme',
                chosen_folder_path.ob.chosen_folder_path,
                folders.mut.chosen_folder_info.nest_level,
                folders.mut.chosen_folder_info.i_to_insert_folder_in,
                custom_folder_path,
            );
        }

    } catch (er) {
        err(er, 98);
    }
};

const append_expanded = action((i_to_insert_folder_in, expanded_folders) => {
    folders.ob.folders.splice(i_to_insert_folder_in, 0, ...sort_folders.sort_folders_inner(expanded_folders));

    folders.ob.folders = folders.ob.folders.slice(0); // clone array (without this search results folders will not expand)
});
