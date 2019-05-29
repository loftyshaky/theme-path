import { basename, dirname, sep } from 'path';

import { action, configure } from 'mobx';
import * as r from 'ramda';
import chokidar from 'chokidar';

import x from 'x';
import * as chosen_folder_path from 'js/chosen_folder_path';
import * as folders from 'js/work_folder/folders';
import * as expand_or_collapse from 'js/work_folder/expand_or_collapse';
import * as new_theme_or_rename from 'js/work_folder/new_theme_or_rename';
import * as sort_folders from 'js/work_folder/sort_folders';
import * as choose_folder from 'js/work_folder/choose_folder';

configure({ enforceActions: 'observed' });

const watcher = chokidar.watch('', { persistent: true, ignoreInitial: true, awaitWriteFinish: true, usePolling: true, depth: 0 });

watcher
    .on('add', action(file_path => {
        try {
            const file_is_manifest = basename(file_path) === 'manifest.json';

            if (file_is_manifest) {
                const parent_folder_path = dirname(file_path);
                const parent_folder_i = folders.ob.folders.findIndex(folder => folder.path === parent_folder_path);
                const folder_to_remove_start_i = parent_folder_i + 1;

                if (folders.ob.folders[folder_to_remove_start_i]) {
                    expand_or_collapse.expand_or_collapse_folder('watcher', parent_folder_path, folders.ob.folders[folder_to_remove_start_i].nest_level, folder_to_remove_start_i);

                    folders.ob.folders[parent_folder_i].is_theme = true;

                    folders.rerender_work_folder();
                }
            }

        } catch (er) {
            err(er, 85);
        }
    }))
    .on('addDir', action(folder_path => {
        try {
            const folder_already_exist = folders.ob.folders.findIndex(folder => folder.path === folder_path) > -1;
            const added_folder_is_in_work_folder = folder_path.indexOf(`${choose_folder.ob.work_folder + sep}`) > -1;

            if (!folder_already_exist && added_folder_is_in_work_folder) {
                const parent_folder_path = dirname(folder_path);
                const parent_folder_is_root = parent_folder_path === choose_folder.ob.work_folder;
                const parent_folder_i = folders.ob.folders.findIndex(folder => folder.path === parent_folder_path);
                const start_i = parent_folder_is_root ? 0 : parent_folder_i + 1;
                const nest_level = parent_folder_is_root ? 0 : folders.ob.folders[parent_folder_i].nest_level + 1;
                const parent_folder_info = folders.get_info_about_folder(parent_folder_path);
                const folder_info = folders.get_info_about_folder(folder_path);
                const parent_folder_is_opened = folders.mut.opened_folders.indexOf(parent_folder_path) > -1;

                if (!parent_folder_is_root) {
                    folders.ob.folders[parent_folder_i].is_theme = parent_folder_info.is_theme;
                    folders.ob.folders[parent_folder_i].is_empty = parent_folder_info.is_empty;
                }

                if (parent_folder_is_opened) {
                    const new_folder = {
                        key: x.unique_id(),
                        name: basename(folder_path),
                        path: folder_path,
                        children: folder_info.children,
                        nest_level,
                        is_theme: folder_info.is_theme,
                        is_empty: folder_info.is_empty,
                    };

                    const folders_with_new_folder = r.insert(0, new_folder, folders.ob.folders);

                    folders.set_folders(sort_folders.sort_folders(folders_with_new_folder, folder_path, start_i, nest_level));

                    new_theme_or_rename.put_new_folder_first(parent_folder_path);
                }

                folders.rerender_work_folder();
            }

        } catch (er) {
            err(er, 86);
        }
    }))
    .on('unlinkDir', action(folder_path => {
        try {
            const deleted_work_folder = folder_path === choose_folder.ob.work_folder;

            if (deleted_work_folder) {
                choose_folder.reset_work_folder(false);

            } else {
                const removed_folder_i = folders.ob.folders.findIndex(folder => folder.path === folder_path);

                if (removed_folder_i > -1) {
                    const removed_folder_nest_level = folders.ob.folders[removed_folder_i].nest_level;

                    folders.set_folders(r.remove(removed_folder_i, 1, folders.ob.folders));

                    //> get parent of removed folder index
                    let current_folder_i = removed_folder_i - 1;

                    while (folders.ob.folders[current_folder_i] && folders.ob.folders[current_folder_i].nest_level === removed_folder_nest_level) {
                        current_folder_i--;
                    }
                    //< get parent of removed folder index

                    if (folders.ob.folders[current_folder_i]) {
                        //> update folder state (theme / not theme /, empty / not empty, opened / closed)
                        const parent_of_removed_folder_i = current_folder_i;
                        const folder_info = folders.get_info_about_folder(folders.ob.folders[parent_of_removed_folder_i].path);

                        folders.ob.folders[parent_of_removed_folder_i].is_theme = folder_info.is_theme;
                        folders.ob.folders[parent_of_removed_folder_i].is_empty = folder_info.is_empty;

                        if (folder_info.is_empty) {
                            const parent_of_removed_folder_path = folders.ob.folders[parent_of_removed_folder_i].path;

                            folders.mut.opened_folders = r.without([parent_of_removed_folder_path], folders.mut.opened_folders);
                        }
                        //< update folder state (theme / not theme /, empty / not empty, opened / closed)
                    }

                    if (folder_path === chosen_folder_path.ob.chosen_folder_path) {
                        folders.deselect_theme();
                    }
                }
            }

        } catch (er) {
            err(er, 87);
        }
    }))
    .on('error', er => {
        err(er, 8);
    });

export const watch_folder = folder_path => {
    try {
        watcher.add(folder_path);
        watcher.add(dirname(folder_path));

    } catch (er) {
        err(er, 88);
    }
};
