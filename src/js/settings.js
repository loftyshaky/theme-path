'use_strict';

import { observable, action, configure } from 'mobx';
import Store from 'electron-store';

import x from 'x';

const store = new Store();
configure({ enforceActions: 'observed' });

//--

export const load_theme = action(() => {
    try {
        const theme_setting = store.get('theme');
        const selected_folder = s('.selected_folder');

        if (theme_setting === 'light') {
            x.load_css(theme_setting);

        } else if (theme_setting === 'dark') {
            x.remove(s('.light'));
        }

        ob.theme = theme_setting;

        if (selected_folder) {
            selected_folder.click();
        }

    } catch (er) {
        err(er, 54);
    }
});

export const load_setting = action(() => {
    try {
        const { settings } = inputs_data.obj;

        settings.forEach(item => {
            const new_item = item;
            new_item.val = store.get(item.name);
        });

        open_and_pack.update_chrome_user_data_dirs_observable();

    } catch (er) {
        err(er, 55);
    }
});

//> variables
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

//< variables

const open_and_pack = require('js/open_and_pack');
const { inputs_data } = require('js/inputs_data');
