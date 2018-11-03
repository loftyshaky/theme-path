import Store from 'electron-store';
import * as r from 'ramda';

const store = new Store();

//--

export const set_defaults = () => {
    try {
        store.set({
            work_folder: '',
            theme: 'dark',
            chrome_dir: '',
            chrome_user_data_dirs: '',
        });

    } catch (er) {
        err(er, 52);
    }
};

(() => {
    try {
        const store_is_empty = r.isEmpty(store.store);

        if (store_is_empty) {
            set_defaults();
        }

    } catch (er) {
        err(er, 53);
    }
})();
