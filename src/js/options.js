import { observable, action } from 'mobx';
import Store from 'electron-store';

import x from 'x';

const store = new Store();

export const ob = observable({
    theme: store.get('theme'),
    theme_vals: {
        dark: {
            color_input_default: 'rgba(251, 255, 117, 1)',
            color_input_disabled: 'rgba(33, 33, 33, 1)',
        },
        light: {
            color_input_default: 'rgba(56, 146, 255, 1)',
            color_input_disabled: 'rgba(255, 255, 255, 1)',
        },
    },
});

const open_and_pack = require('js/open_and_pack');
const custom_folders = require('js/work_folder/custom_folders');
const { inputs_data } = require('js/inputs_data');

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
        Object.values(inputs_data.obj.options).forEach((item) => {
            const new_item = item;

            new_item.val = store.get(item.name);
        });

        open_and_pack.update_chrome_exe_paths_observable();
        open_and_pack.update_chrome_user_data_folders_observable();
        custom_folders.update_custom_folders_observable();
    } catch (er) {
        err(er, 55);
    }
});
