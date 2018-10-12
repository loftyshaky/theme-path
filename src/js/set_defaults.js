import x from 'x';

const Store = require('electron-store');
const store = new Store();

import * as r from 'ramda';

export const set_defaults = () => {
    store.set({ work_folder: '' })
};

const store_is_empty = r.isEmpty(store.store);

if (store_is_empty) {
    set_defaults();
}