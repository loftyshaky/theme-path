'use_strict';

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
});