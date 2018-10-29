import x from 'x';

import Store from 'electron-store';
import * as r from 'ramda';

const store = new Store();

//--

export const set_defaults = () => {
    store.set({
        work_folder: '',
        theme: 'dark',
        chrome_dir: '',
        chrome_user_data_dirs: ''
    });
};

const store_is_empty = r.isEmpty(store.store);

if (store_is_empty) {
    set_defaults();
}