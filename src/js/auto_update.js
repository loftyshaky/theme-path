'use_strict';

import { ipcRenderer } from 'electron';

import { observable, action, configure } from 'mobx';

import * as analytics from 'js/analytics';

configure({ enforceActions: 'observed' });

ipcRenderer.on('update_downloaded', () => {
    show_or_hide_auto_updater(true);
});

export const install_update = () => {
    try {
        const name = 'install_update';

        analytics.send_event_async('btns', `clicked-auto_updater-${name}`, ipcRenderer.send, [name]);

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
