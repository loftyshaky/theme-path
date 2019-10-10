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
                settings[key] = val;
            }
        });

        store.set(settings);

    } catch (er) {
        err(er, 192);
    }
};

const normalize_default_bulk_copy_checkboxes_obj = () => {
    try {
        const { default_bulk_copy_checkboxes } = store.get();

        Object.keys(con.default_settings.default_bulk_copy_checkboxes).forEach(family => {
            if (default_bulk_copy_checkboxes[family] == null) {
                default_bulk_copy_checkboxes[family] = {};
            }

            Object.entries(con.default_settings.default_bulk_copy_checkboxes[family]).forEach(([name, val]) => {
                if (default_bulk_copy_checkboxes[family] == null || default_bulk_copy_checkboxes[family][name] == null) {
                    default_bulk_copy_checkboxes[family][name] = val;
                }
            });
        });

        store.set('default_bulk_copy_checkboxes', default_bulk_copy_checkboxes);

    } catch (er) {
        err(er, 267);
    }
};

const generate_default_bulk_copy_checkboxes_obj = inputs_data => {
    try {
        const bulk_copy_checkboxes_obj = {};

        Object.keys(inputs_data.obj).forEach(family => {
            if (family !== 'options') {
                bulk_copy_checkboxes_obj[family] = {};

                Object.keys(inputs_data.obj[family]).forEach(name => {
                    if (name !== 'locale') {
                        bulk_copy_checkboxes_obj[family][name] = inputs_data.obj[family][name].bulk_copy_checkbox_checked_by_default;
                    }
                });
            }
        });

        return bulk_copy_checkboxes_obj;

    } catch (er) {
        err(er, 265);
    }

    return undefined;
};

export const set_default_bulk_copy_checkboxes_obj = inputs_data => {
    try {
        con.default_settings.default_bulk_copy_checkboxes = generate_default_bulk_copy_checkboxes_obj(inputs_data);

        normalize_default_bulk_copy_checkboxes_obj();

    } catch (er) {
        err(er, 266);
    }
};

const con = {
    default_settings: {
        work_folder: '',
        theme: 'dark',
        language: 'system',
        history_side_popup_width: 700,
        chrome_exe_paths: '',
        chrome_user_data_folders: '',
        custom_folders: '',
        max_number_of_history_records: 250,
        locales_whitelist: '',
        tutorial_stage: 1,
        show_help: true,
        answered_to_analytics_privacy_question: false,
        enable_analytics: false,
        default_bulk_copy_checkboxes: {},
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
