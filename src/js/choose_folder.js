const Store = require('electron-store');
const { dialog } = require('electron').remote;

const store = new Store();

export const choose_folder = (key, callback) => {
    const path = dialog.showOpenDialog({
        properties: ['openDirectory']
    });

    if (path) { // if not cancelled folder chosing
        const final_path = path[0].replace(/\\/g, '/');

        store.set(key, final_path);

        callback();

        if (key == 'work_folder') {

        }
    }
};