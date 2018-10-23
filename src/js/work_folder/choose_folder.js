import * as wf_shared from 'js/work_folder/shared';
import * as watch from 'js/work_folder/watch';

const Store = require('electron-store');
const { dialog } = require('electron').remote;

const store = new Store();

export const choose_folder = (key, callback) => {
    const path = dialog.showOpenDialog({
        properties: ['openDirectory']
    });

    if (path) { // if not cancelled folder chosing
        watch.unwatch_folder(store.get('work_folder'));

        for (const opened_folder of wf_shared.mut.opened_folders) {
            watch.unwatch_folder(opened_folder);
        }

        watch.watch_folder(path[0]);

        store.set(key, path[0]);

        callback();

        if (key == 'work_folder') {

        }
    }
};