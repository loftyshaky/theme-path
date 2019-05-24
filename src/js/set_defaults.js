import Store from 'electron-store';
import * as r from 'ramda';

const store = new Store();

export const set_defaults = () => {
    try {
        store.set(con.default_settings);

    } catch (er) {
        err(er, 52);
    }
};

const normalize = () => {
    try {
        const settings = store.get();

        Object.entries(con.default_settings).forEach(([key, val]) => {
            if (settings[key] == null) {
                store.set(key, val);
            }
        });

    } catch (er) {
        err(er, 192);
    }
};

const con = {
    default_settings: {
        work_folder: '',
        theme: 'dark',
        language: 'system',
        history_popup_width: 700,
        chrome_exe_paths: '',
        chrome_user_data_folders: '',
        custom_folders: '',
        locales_whitelist: '',
        tutorial_stage: 1,
        answered_to_analytics_privacy_question: false,
        enable_analytics: false,
    },
};

(() => {
    try {
        const store_is_empty = r.isEmpty(store.store);

        if (store_is_empty) {
            set_defaults();

        } else {
            normalize();
        }

    } catch (er) {
        err(er, 53);
    }
})();
