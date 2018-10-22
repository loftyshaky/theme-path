const Store = require('electron-store');
const { dialog } = require('electron').remote;

const store = new Store();

export const choose_folder = (key, callback) => {
    const path = dialog.showOpenDialog({
        properties: ['openDirectory']
    });

    if (path) { // if not cancelled folder chosing
        store.set(key, path[0]);

        callback();

        if (key == 'work_folder') {

        }
    }
};