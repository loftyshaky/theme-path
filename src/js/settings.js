'use_strict';

import * as open_in_chrome from 'js/open_in_chrome';
import { inputs_data } from 'js/inputs_data';

import { action, configure } from "mobx";
const Store = require('electron-store');

const store = new Store();

configure({ enforceActions: 'observed' });

export const load_setting = action(() => {
    const settings = inputs_data.obj.settings;

    for (const item of settings) {
        item.val = store.get(item.name);
    }

    open_in_chrome.update_chrome_user_data_dirs_observable();
});