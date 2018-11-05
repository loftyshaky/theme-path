import { observable, action, configure } from 'mobx';
import Store from 'electron-store';

import * as shared from 'js/shared';
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

//> variables
export const ob = observable({
    work_folder: store.get('work_folder'),
});
//< variables
