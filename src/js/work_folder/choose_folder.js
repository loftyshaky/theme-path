import { existsSync } from 'fs-extra';

import { observable, action, configure } from 'mobx';
import Store from 'electron-store';

import * as shared from 'js/shared';
import * as wf_shared from 'js/work_folder/wf_shared';
import * as expand_or_collapse from 'js/work_folder/expand_or_collapse';
import * as watch from 'js/work_folder/watch';

const { dialog } = require('electron').remote;

configure({ enforceActions: 'observed' });
const store = new Store();

//--

export const choose_folder = callback => {
    try {
        const folder_path = dialog.showOpenDialog({
            properties: ['openDirectory'],
        });

        if (folder_path) { // if not cancelled folder chosing
            change_work_folder(folder_path[0]);

            shared.deselect_theme();

            callback();
        }

    } catch (er) {
        err(er, 70);
    }
};

export const change_work_folder = action(folder_path => {
    try {
        watch.watch_folder(folder_path);

        store.set('work_folder', folder_path);

        ob.work_folder = folder_path;

    } catch (er) {
        err(er, 124);
    }
});

export const reset_work_folder = action(terminate_script => {
    try {
        const work_folder_exist = existsSync(ob.work_folder);

        if (!work_folder_exist) {
            wf_shared.ob.chosen_folder_info.is_theme = false;
            shared.ob.default_locale_theme_name = '';

            change_work_folder('');
            expand_or_collapse.close_all_folders();
            shared.deselect_theme();

            document.activeElement.blur();

            if (terminate_script) {
                err(er_obj('Work folder doesnt exist'), 126, 'work_folder_doesnt_exist', false, false, true);

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

//> variables
export const ob = observable({
    work_folder: store.get('work_folder'),
});
//< variables
