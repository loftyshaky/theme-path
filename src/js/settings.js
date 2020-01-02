import { configure, observable, action } from 'mobx';
import Store from 'electron-store';
import * as r from 'ramda';

configure({ enforceActions: 'observed' });
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

const normalize_bulk_copy_checkboxes_obj = key => {
    try {
        const bulk_copy_checkboxes = store.get(key);

        Object.keys(con.default_settings.bulk_copy_checkboxes).forEach(family => {
            if (bulk_copy_checkboxes[family] == null) {
                bulk_copy_checkboxes[family] = {};
            }

            Object.entries(con.default_settings.bulk_copy_checkboxes[family]).forEach(([name, val]) => {
                if (name !== 'locale' && (bulk_copy_checkboxes[family] == null || bulk_copy_checkboxes[family][name] == null)) {
                    bulk_copy_checkboxes[family][name] = val;
                }
            });
        });

        store.set(key, bulk_copy_checkboxes);

    } catch (er) {
        err(er, 267);
    }
};

const generate_bulk_copy_checkboxes_obj = inputs_data => {
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
        const bulk_copy_checkboxes_obj = generate_bulk_copy_checkboxes_obj(inputs_data);

        con.default_settings.bulk_copy_checkboxes = bulk_copy_checkboxes_obj;
        con.default_settings.default_bulk_copy_checkboxes = bulk_copy_checkboxes_obj;

        normalize_bulk_copy_checkboxes_obj('bulk_copy_checkboxes');
        normalize_bulk_copy_checkboxes_obj('default_bulk_copy_checkboxes');

    } catch (er) {
        err(er, 266);
    }
};

export const set_settings_observable = action(() => {
    try {
        ob.settings = store.get();

    } catch (er) {
        err(er, 311);
    }
});

export const ob = observable({
    settings: {},
});

const con = {
    default_settings: {
        work_folder: '',
        theme: 'light',
        language: 'system',
        history_side_popup_width: 700,
        chrome_exe_paths: '',
        chrome_user_data_folders: '',
        custom_folders: '',
        max_number_of_history_records: 250,
        locales_whitelist: '',
        tutorial_stage: 1,
        show_help: true,
        highlight_odd_elements: true,
        wrap_theme_metadata_and_theme_fieldsets: false,
        color_picker_default_mode: 'HSVA',
        set_color_picker_to_default_mode_when_opening_it: false,
        highlight_color_picker_val_when_opening_color_picker: true,
        answered_to_analytics_privacy_question: false,
        enable_analytics: false,
        bulk_copy_checkboxes: {},
        default_bulk_copy_checkboxes: {},
        previous_img: {},
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
