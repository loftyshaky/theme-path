import { basename, dirname } from 'path';

import { action, configure } from 'mobx';
import * as r from 'ramda';
import chokidar from 'chokidar';

import x from 'x';
import * as shared from 'js/shared';
import * as wf_shared from 'js/work_folder/wf_shared';
import * as expand_or_collapse from 'js/work_folder/expand_or_collapse';
import * as sort_folders from 'js/work_folder/sort_folders';
import * as choose_folder from 'js/work_folder/choose_folder';

configure({ enforceActions: 'observed' });

//--

const watcher = chokidar.watch(null, { persistent: true, ignoreInitial: true, awaitWriteFinish: true, usePolling: true, depth: 0 });

watcher
    .on('add', action(file_path => {
        try {
            const file_is_manifest = basename(file_path) === 'manifest.json';

            if (file_is_manifest) {
                const parent_folder_path = dirname(file_path);
                const parent_folder_i = wf_shared.ob.folders.findIndex(folder => folder.path === parent_folder_path);
                const folder_to_remove_start_i = parent_folder_i + 1;

                if (wf_shared.ob.folders[folder_to_remove_start_i]) {
                    expand_or_collapse.expand_or_collapse_folder('watcher', parent_folder_path, wf_shared.ob.folders[folder_to_remove_start_i].nest_level, folder_to_remove_start_i);

                    wf_shared.ob.folders[parent_folder_i].is_theme = true;

                    wf_shared.rerender_work_folder();
                }
            }

        } catch (er) {
            err(er, 85);
        }
    }))
    .on('addDir', action(folder_path => {
        try {
            const parent_folder_path = dirname(folder_path);
            const added_folder_is_in_work_folder = parent_folder_path === choose_folder.ob.work_folder;
            const folder_already_exist = wf_shared.ob.folders.findIndex(folder => folder.path === folder_path) > -1;

            if (added_folder_is_in_work_folder && !folder_already_exist) {
                const parent_folder_is_root = parent_folder_path === choose_folder.ob.work_folder;
                const parent_folder_i = wf_shared.ob.folders.findIndex(folder => folder.path === parent_folder_path);
                const i_to_insert_folfder_in = parent_folder_is_root ? 0 : parent_folder_i + 1;
                const nest_level = parent_folder_is_root ? 0 : wf_shared.ob.folders[parent_folder_i].nest_level + 1;
                const number_of_folders = wf_shared.get_number_of_folders_to_work_with(i_to_insert_folfder_in, nest_level) + 1;
                const parent_folder_info = wf_shared.get_info_about_folder(parent_folder_path);
                const folder_info = wf_shared.get_info_about_folder(folder_path);
                const parent_folder_is_opened = wf_shared.mut.opened_folders.indexOf(parent_folder_path) > -1;

                if (!parent_folder_is_root) {
                    wf_shared.ob.folders[parent_folder_i].is_theme = parent_folder_info.is_theme;
                    wf_shared.ob.folders[parent_folder_i].is_empty = parent_folder_info.is_empty;
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

                    const folders_with_new_folder = r.insert(i_to_insert_folfder_in, new_folder, wf_shared.ob.folders);

                    wf_shared.set_folders(sort_folders.sort_folders(folders_with_new_folder, i_to_insert_folfder_in, number_of_folders, nest_level));
                }

                wf_shared.rerender_work_folder();
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
                const removed_folder_i = wf_shared.ob.folders.findIndex(folder => folder.path === folder_path);

                if (removed_folder_i > -1) {
                    const removed_folder_nest_level = wf_shared.ob.folders[removed_folder_i].nest_level;

                    wf_shared.set_folders(r.remove(removed_folder_i, 1, wf_shared.ob.folders));

                    //> get parent of removed folder index
                    let current_folder_i = removed_folder_i - 1;

                    while (wf_shared.ob.folders[current_folder_i] && wf_shared.ob.folders[current_folder_i].nest_level === removed_folder_nest_level) {
                        current_folder_i--;
                    }
                    //< get parent of removed folder index

                    if (wf_shared.ob.folders[current_folder_i]) {
                        //> update folder state (theme / not theme /, empty / not empty, opened / closed)
                        const parent_of_removed_folder_i = current_folder_i;
                        const folder_info = wf_shared.get_info_about_folder(wf_shared.ob.folders[parent_of_removed_folder_i].path);

                        wf_shared.ob.folders[parent_of_removed_folder_i].is_theme = folder_info.is_theme;
                        wf_shared.ob.folders[parent_of_removed_folder_i].is_empty = folder_info.is_empty;

                        if (folder_info.is_empty) {
                            const parent_of_removed_folder_path = wf_shared.ob.folders[parent_of_removed_folder_i].path;

                            wf_shared.mut.opened_folders = r.without([parent_of_removed_folder_path], wf_shared.mut.opened_folders);
                        }
                        //< update folder state (theme / not theme /, empty / not empty, opened / closed)
                    }

                    if (folder_path === shared.ob.chosen_folder_path) {
                        shared.deselect_theme();
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
