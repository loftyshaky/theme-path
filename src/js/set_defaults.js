import Store from 'electron-store';
import * as r from 'ramda';

const store = new Store();

export const set_defaults = () => {
    try {
        store.set({
            work_folder: '',
            theme: 'dark',
            language: 'system',
            chrome_exe_path: '',
            chrome_user_data_dirs: '',
            custom_folders: '',
            locales_whitelist: '',
            tutorial_stage: 1,
            answered_to_analytics_privacy_question: false,
            enable_analytics: false,
            enable_analytics_dev: false,
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
