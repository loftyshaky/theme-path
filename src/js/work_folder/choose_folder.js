import { existsSync } from 'fs-extra';

import { observable, action } from 'mobx';
import Store from 'electron-store';

import * as tutorial from 'js/tutorial';
import * as processing_msg from 'js/processing_msg';
import * as chosen_folder_path from 'js/chosen_folder_path';
import * as folders from 'js/work_folder/folders';
import * as expand_or_collapse from 'js/work_folder/expand_or_collapse';
import * as watch from 'js/work_folder/watch';
import * as search from 'js/work_folder/search';

// eslint-disable-next-line import/no-extraneous-dependencies
const remote = require('@electron/remote');

const store = new Store();

export const ob = observable({
    work_folder: store.get('work_folder'),
});

export const change_work_folder = action((folder_path) => {
    try {
        search.remove_search_val();

        watch.watch_folder(folder_path);

        store.set('work_folder', folder_path);

        ob.work_folder = folder_path;
    } catch (er) {
        err(er, 124);
    }
});

export const choose_folder = (callback) => {
    try {
        const folder_path = remote.dialog.showOpenDialogSync({
            properties: ['openDirectory'],
        });

        if (folder_path) {
            // if not cancelled folder chosing
            processing_msg.process(() => {
                change_work_folder(folder_path[0]);

                folders.deselect_theme();
                chosen_folder_path.deselect_all_bulk_folders();

                callback();

                if (tutorial.ob.tutorial_stage === 1 || tutorial.ob.tutorial_stage === 2) {
                    if (tutorial.ob.tutorial_stage === 1) {
                        tutorial.increment_tutorial_stage(false);
                    }

                    const there_is_non_theme_folder = folders.ob.folders.some(
                        (folder) => !folder.is_theme,
                    );

                    if (folders.ob.folders.length === 0 || !there_is_non_theme_folder) {
                        tutorial.increment_tutorial_stage(false);
                    }
                }
            });
        }
    } catch (er) {
        err(er, 70);
    }
};

export const reset_work_folder = action((terminate_script) => {
    try {
        const work_folder_exist = existsSync(ob.work_folder);

        if (!work_folder_exist) {
            change_work_folder('');
            expand_or_collapse.collapse_all_folders();
            folders.deselect_theme();

            document.activeElement.blur();

            if (terminate_script) {
                err(
                    er_obj('Work folder doesnt exist'),
                    126,
                    'work_folder_doesnt_exist',
                    false,
                    false,
                    true,
                );
            } else {
                err(er_obj('Work folder doesnt exist'), 127, 'work_folder_doesnt_exist');
            }

            return false;
        }

        return true;
    } catch (er) {
        err(er, 128);

        return false;
    }
});
