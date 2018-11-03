import Store from 'electron-store';

import * as shared from 'js/shared';
import * as watch from 'js/work_folder/watch';

const { dialog } = require('electron').remote;

const store = new Store();

//--

export const choose_folder = (key, callback) => {
    try {
        const folder_path = dialog.showOpenDialog({
            properties: ['openDirectory'],
        });

        if (folder_path) { // if not cancelled folder chosing
            watch.watch_folder(folder_path[0]);

            store.set(key, folder_path[0]);

            shared.deselect_theme();

            callback();
        }

    } catch (er) {
        err(er, 70);
    }
};
