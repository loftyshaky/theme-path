'use_strict';

import { ipcRenderer } from 'electron';

import { observable, action, configure } from 'mobx';

configure({ enforceActions: 'observed' });

ipcRenderer.on('update_downloaded', () => {
    show_or_hide_auto_updater(true);
});

export const install_update = () => {
    try {
        ipcRenderer.send('install_update');

    } catch (er) {
        err(er, 158);
    }
};

export const show_or_hide_auto_updater = action(bool => {
    try {
        ob.auto_updater_visible = bool;

    } catch (er) {
        err(er, 159);
    }
});

//> variables
export const ob = observable({
    auto_updater_visible: false,
});
//< variables
