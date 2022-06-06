// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer } from 'electron';

import { observable, action } from 'mobx';

export const ob = observable({
    auto_updater_visible: false,
});

export const show_or_hide_auto_updater = action((bool) => {
    try {
        ob.auto_updater_visible = bool;
    } catch (er) {
        err(er, 159);
    }
});

ipcRenderer.on('update_downloaded', () => {
    show_or_hide_auto_updater(true);
});

export const install_update = () => {
    try {
        ipcRenderer.send(['install_update']);
    } catch (er) {
        err(er, 158);
    }
};
