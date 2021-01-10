import { observable, action, configure } from 'mobx';
import * as r from 'ramda';
import Store from 'electron-store';

import x from 'x';
import * as options from 'js/options';

const store = new Store();
configure({ enforceActions: 'observed' });

const { color_input_default } = options.ob.theme_vals[store.get('theme')];

//> input generator functions
const textarea = (name, add_help, counter, char_limit) => {
    try {
        return {
            name,
            type: 'textarea',
            val: '',
            add_help,
            counter,
            char_limit,
            bulk_copy_checkbox_checked_by_default: false,
        };

    } catch (er) {
        err(er, 233);
    }

    return undefined;
};

const select = (name, val, add_help) => {
    try {
        return {
            name,
            type: 'select',
            val: val || '',
            add_help,
            bulk_copy_checkbox_checked_by_default: true,
        };

    } catch (er) {
        err(er, 234);
    }

    return undefined;
};

const checkbox = name => {
    try {
        return {
            name,
            type: 'checkbox',
            val: true,
            add_help: false,
        };

    } catch (er) {
        err(er, 237);
    }

    return undefined;
};

const color = name => {
    try {
        return {
            name,
            type: 'color',
            val: color_input_default,
            color_pickier_is_visible: false,
            color_pickiers_position: 'top',
            default: true,
            changed_color_once_after_focus: false,
            add_help: true,
            bulk_copy_checkbox_checked_by_default: true,
        };

    } catch (er) {
        err(er, 236);
    }

    return undefined;
};

const img_selector = (name, bulk_copy_checkbox_checked_by_default) => {
    try {
        return {
            name,
            type: 'img_selector',
            val: '',
            highlight_upload_box: false,
            color: color_input_default,
            color_pickier_is_visible: false,
            color_pickiers_position: 'top',
            img_dims: {
                width: null,
                height: null,
            },
            default: true,
            changed_color_once_after_focus: false,
            add_help: true,
            bulk_copy_checkbox_checked_by_default: typeof bulk_copy_checkbox_checked_by_default === 'boolean' ? bulk_copy_checkbox_checked_by_default : true,
        };

    } catch (er) {
        err(er, 235);
    }

    return undefined;
};

const tint = name => {
    try {
        return {
            name,
            type: 'tint',
            val: ['', '', ''],
            default: true,
            disabled: false,
            add_help: true,
            bulk_copy_checkbox_checked_by_default: true,
        };

    } catch (er) {
        err(er, 325);
    }

    return undefined;
};

const options_btns = name => {
    try {
        return {
            name,
            type: 'options_btns',
        };

    } catch (er) {
        err(er, 239);
    }

    return undefined;
};
//< input generator functions

const inputs = {
    theme_metadata: [
        img_selector('icon'),
        select('locale', null, true),
        select('default_locale', null, true),
        textarea('version'),
        textarea('name', true, true, 45),
        textarea('description', true, true, 132),
    ],
    images: [
        img_selector('theme_ntp_background', false),
        img_selector('theme_toolbar'),
        img_selector('theme_frame'),
        img_selector('theme_frame_inactive'),
        img_selector('theme_frame_incognito'),
        img_selector('theme_frame_incognito_inactive'),
        img_selector('theme_frame_overlay'),
        img_selector('theme_frame_overlay_inactive'),
        img_selector('theme_tab_background'),
        img_selector('theme_tab_background_inactive'),
        img_selector('theme_tab_background_incognito'),
        img_selector('theme_tab_background_incognito_inactive'),
        img_selector('theme_tab_background_v'),
        img_selector('theme_window_control_background'),
        img_selector('theme_ntp_attribution'),
    ],
    colors: [
        color('ntp_background'),
        color('toolbar'),
        color('frame'),
        color('frame_inactive'),
        color('frame_incognito'),
        color('frame_incognito_inactive'),
        color('background_tab'),
        color('background_tab_inactive'),
        color('background_tab_incognito'),
        color('background_tab_incognito_inactive'),
        color('omnibox_background'),
        color('bookmark_text'),
        color('tab_text'),
        color('tab_background_text'),
        color('tab_background_text_inactive'),
        color('tab_background_text_incognito'),
        color('tab_background_text_incognito_inactive'),
        color('omnibox_text'),
        color('toolbar_button_icon'),
        color('button_background'),
        color('ntp_text'),
        color('ntp_link'),
        color('ntp_header'),
    ],
    tints: [
        tint('frame'),
        tint('frame_inactive'),
        tint('frame_incognito'),
        tint('frame_incognito_inactive'),
        tint('background_tab'),
        tint('buttons'),
    ],
    properties: [
        select('ntp_background_alignment', 'default', true),
        select('ntp_background_repeat', 'default', true),
        select('ntp_logo_alternate', 'default', true),
    ],
    clear_new_tab: [
        img_selector('clear_new_tab_video', false),
        select('video_volume', 'default', true),
        select('size', 'default', true),
    ],
    options: [
        select('theme', 'default', false),
        select('language', 'default', false),
        select('color_picker_default_mode'),
        textarea('chrome_exe_paths', true),
        textarea('chrome_user_data_folders', true),
        textarea('custom_folders', true),
        textarea('max_number_of_history_records', true),
        textarea('locales_whitelist', true),
        checkbox('show_help'),
        checkbox('highlight_odd_elements'),
        checkbox('set_color_picker_to_default_mode_when_opening_it'),
        checkbox('highlight_color_picker_val_when_opening_color_picker'),
        checkbox('wrap_theme_metadata_and_theme_fieldsets'),
        checkbox('enable_analytics'),
        options_btns('options_btns'),
    ],
};

Object.entries(inputs).forEach(([family, elements]) => {
    try {
        inputs[family] = elements.reduce((obj, item) => {
            obj[item.name] = item; // eslint-disable-line no-param-reassign
            obj[item.name].family = family; // eslint-disable-line no-param-reassign
            obj[item.name].key = x.unique_id(); // eslint-disable-line no-param-reassign

            return obj;
        }, {});

    } catch (er) {
        err(er, 232);
    }
});

export const inputs_data = observable({
    obj: inputs,
});

export const reset_inputs_data = action(() => {
    try {
        inputs_data.obj = data_obj_default;

        options.load_setting();

    } catch (er) {
        err(er, 45);
    }
});

export const set_inputs_data = action(new_inputs_data => {
    try {
        inputs_data.obj = new_inputs_data;

    } catch (er) {
        err(er, 201);
    }
});

const data_obj_default = r.clone(inputs_data.obj);

observable(inputs_data);
