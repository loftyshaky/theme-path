'use_strict';

import x from 'x';

import { observable, action, configure } from 'mobx';
const Store = require('electron-store');

const store = new Store();

configure({ enforceActions: 'observed' });

export const load_theme = action(() => {
    const theme_setting = store.get('theme');
    const selected_folder = s('.selected_folder');

    if (theme_setting == 'light') {
        x.load_css(theme_setting);

    } else if (theme_setting == 'dark') {
        x.remove(s('.light'));
    }

    ob.theme = theme_setting;

    if (selected_folder) {
        selected_folder.click();
    }
});

export const load_setting = action(() => {
    const settings = inputs_data.obj.settings;

    for (const item of settings) {
        item.val = store.get(item.name);
    }

    open_and_pack.update_chrome_user_data_dirs_observable();
});

//> variables
export const ob = observable({
    theme: store.get('theme'),
    theme_vals: {
        dark: {
            upload_box: '#3b6ab5',
            fieldset: '#333333',
            legend: '#474747',
            color_input_default: '#fbff75',
            color_input_disabled: '#212121'
        },
        light: {
            upload_box: '#ffd375',
            fieldset: '#d3d3d3',
            legend: '#d3d3d3',
            color_input_default: '#3892ff',
            color_input_disabled: 'white'
        }
    }
});

//< variables

const open_and_pack = require('js/open_and_pack');
const { inputs_data } = require('js/inputs_data');