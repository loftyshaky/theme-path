import * as watch from 'js/work_folder/watch';

const Store = require('electron-store');
const { dialog } = require('electron').remote;

const store = new Store();

export const choose_folder = (key, callback) => {
    const path = dialog.showOpenDialog({
        properties: ['openDirectory']
    });

    if (path) { // if not cancelled folder chosing
        watch.watch_folder(path[0]);

        store.set(key, path[0]);

        callback();

        if (key == 'work_folder') {

        }
    }
};