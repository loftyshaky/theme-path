'use_strict';

import Store from 'electron-store';
import { observable, action, configure } from 'mobx';

configure({ enforceActions: 'observed' });
const store = new Store();

export const update_custom_folders_observable = action(() => {
    try {
        ob.custom_folders = store.get('custom_folders');

    } catch (er) {
        err(er, 187);
    }
});

export const ob = observable({
    custom_folders: null,
});
