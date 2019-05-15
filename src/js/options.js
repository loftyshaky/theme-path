'use_strict';

import { observable, action, configure } from 'mobx';
import Store from 'electron-store';

import * as toggle_popup from 'js/toggle_popup';

import x from 'x';

const store = new Store();
configure({ enforceActions: 'observed' });

export const load_theme = action(() => {
    try {
        const theme_setting = store.get('theme');

        if (theme_setting === 'light') {
            x.load_css(theme_setting);

        } else if (theme_setting === 'dark') {
            x.remove(s('.light'));
        }

        ob.theme = theme_setting;

    } catch (er) {
        err(er, 54);
    }
});

export const load_setting = action(() => {
    try {
        Object.values(inputs_data.obj.options).forEach(item => {
            const new_item = item;

            new_item.val = store.get(item.name);
        });

        open_and_pack.update_chrome_user_data_dirs_observable();
        custom_folders.update_custom_folders_observable();

    } catch (er) {
        err(er, 55);
    }
});

export const ob = observable({
    theme: store.get('theme'),
    theme_vals: {
        dark: {
            color_input_default: '#fbff75',
            color_input_disabled: '#212121',
        },
        light: {
            color_input_default: '#3892ff',
            color_input_disabled: 'white',
        },
    },
});

const open_and_pack = require('js/open_and_pack');
const custom_folders = require('js/work_folder/custom_folders');
const { inputs_data } = require('js/inputs_data');
