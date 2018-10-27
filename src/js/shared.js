
'use strict';

import { action, observable, configure } from "mobx";
const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');
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

export const set_default_locale_theme_name = (name, val) => {
    if (name == 'name') {
        ob.default_locale_theme_name = val;
    }
};

export const construct_icons_obj = json => {
    if (!json.icons) {
        json.icons = {};
    }

    if (!json['128']) {
        json['128'] = {};
    }
};

export const write_to_json = (json, json_path) => {
    const new_json = JSON.stringify(json);

    writeFileSync(json_path, new_json, 'utf8');
};

export const get_icon_paths = () => {
    const default_icon_soure_path = resolve('resources', 'app', 'dist', 'new_theme', 'icon.png');
    const default_icon_target_path = resolve(ob.chosen_folder_path, 'icon.png');

    return {
        source: default_icon_soure_path,
        target: default_icon_target_path
    }
};

//> varibles t
export const ob = observable({
    chosen_folder_path: store.get('work_folder'),
    default_locale_theme_name: null,
});

export const mut = {
    manifest: null
};
//< varibles t

const { reset_inputs_data } = require('js/inputs_data');