'use strict';

import x from 'x';
import * as shared from 'js/shared';
import * as wf_shared from 'js/work_folder/shared';
import * as sort_folders from 'js/work_folder/sort_folders';

import { action, configure } from "mobx";
import * as r from 'ramda';
const chokidar = require('chokidar');
const path = require('path');
const Store = require('electron-store');

const store = new Store();

configure({ enforceActions: 'observed' });

const watcher = chokidar.watch(null, { persistent: true, ignoreInitial: true, awaitWriteFinish: true, depth: 0 });

watcher
    .on('addDir', action(file_path => {
        console.log('File', file_path, 'has been added');
        const folder_already_exist = wf_shared.ob.folders.findIndex(folder => folder.path == file_path) > -1;
l
        if (!folder_already_exist || file_is_manifest) {
            const parent_folder_path = path.dirname(file_path);
            const parent_folder_is_root = parent_folder_path == store.get('work_folder');
            const parent_folder_i = wf_shared.ob.folders.findIndex(folder => folder.path == parent_folder_path);
            const i_to_insert_folfder_in = parent_folder_is_root ? 0 : parent_folder_i + 1;
            const nest_level = parent_folder_is_root ? 0 : wf_shared.ob.folders[parent_folder_i].nest_level + 1;
            const number_of_folders = wf_shared.get_number_of_folders_to_work_with(i_to_insert_folfder_in, nest_level) + 1;
            const parent_folder_info = wf_shared.get_info_about_folder(parent_folder_path);
            const folder_info = wf_shared.get_info_about_folder(file_path);
            const parent_folder_is_opened = wf_shared.mut.opened_folders.indexOf(parent_folder_path) > -1;

            if (!parent_folder_is_root) {
                l(parent_folder_info.is_theme)
                wf_shared.ob.folders[parent_folder_i].is_theme = parent_folder_info.is_theme;
                wf_shared.ob.folders[parent_folder_i].is_empty = parent_folder_info.is_empty;
            }

            if (parent_folder_is_opened) {
                const new_folder = {
                    key: x.unique_id(),
                    name: path.basename(file_path),
                    path: file_path,
                    children: folder_info.children,
                    nest_level: nest_level,
                    is_theme: folder_info.is_theme,
                    is_empty: folder_info.is_empty
                }

                const folders_with_new_folder = r.insert(i_to_insert_folfder_in, new_folder, wf_shared.ob.folders);

                wf_shared.ob.folders = sort_folders.sort_folders(folders_with_new_folder, i_to_insert_folfder_in, number_of_folders, nest_level);
            }

            wf_shared.rerender_work_folder();
        }
    }))
    .on('unlinkDir', action(file_path => {
        console.log('File', file_path, 'has been removed');

        const removed_folder_i = wf_shared.ob.folders.findIndex(folder => folder.path == file_path);

        if (removed_folder_i > -1) {
            const removed_folder_nest_level = wf_shared.ob.folders[removed_folder_i].nest_level;

            wf_shared.ob.folders = r.remove(removed_folder_i, 1, wf_shared.ob.folders);

            //> get parent of removed folder index
            let current_folder_i = removed_folder_i - 1;

            while (wf_shared.ob.folders[current_folder_i] && wf_shared.ob.folders[current_folder_i].nest_level == removed_folder_nest_level) {
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
        }
    }))
    .on('error', er => {
        x.error(8);
        console.error(er);
    });

export const watch_folder = (folder_path) => {
    watcher.add(folder_path)
};