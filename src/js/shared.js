
'use strict';

import { action, observable, configure } from "mobx";
const { readFileSync } = require('fs');
const Store = require('electron-store');

const store = new Store();

configure({ enforceActions: 'observed' });

export const parse_json = file_path => {
    return JSON.parse(readFileSync(file_path, 'utf-8').trim());
};

export const find_from_name = (array, name) => {
    return array.find(item => item.name === name);
};

export const find_from_val = (array, val) => {
    return array.find(item => item.val === val);
};

export const val_is_localized = val => {
    return val.indexOf('__MSG_') > -1;
};

export const get_message_key = val => {
    return val.replace(/__MSG_|__/g, '');
};

export const deselect_theme = action(() => {
    ob.chosen_folder_path = store.get('work_folder');

    reset_inputs_data();
});

//> varibles t
export const ob = observable({
    chosen_folder_path: store.get('work_folder')
});

export const mut = {
    manifest: null
};
//< varibles t

const { reset_inputs_data } = require('js/inputs_data');