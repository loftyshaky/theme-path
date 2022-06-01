import Store from 'electron-store';
import { observable, action } from 'mobx';

const store = new Store();

export const ob = observable({
    custom_folders: null,
});

export const update_custom_folders_observable = action(() => {
    try {
        ob.custom_folders = store.get('custom_folders');
    } catch (er) {
        err(er, 187);
    }
});
