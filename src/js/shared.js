import { action, observable, configure } from 'mobx';

import { resolve } from 'path';
import { readFileSync, writeJsonSync } from 'fs-extra';

import * as choose_folder from 'js/work_folder/choose_folder';

configure({ enforceActions: 'observed' });

//--

export const set_chosen_folder_path = action(chosen_folder_path => {
    try {
        ob.chosen_folder_path = chosen_folder_path;

    } catch (er) {
        err(er, 56);
    }
});

export const parse_json = file_path => {
    try {
        return JSON.parse(readFileSync(file_path, 'utf-8').trim());

    } catch (er) {
        err(er, 57, null, true);
    }

    return undefined;
};

export const find_from_name = (array, name) => {
    try {
        return array.find(item => item.name === name);

    } catch (er) {
        err(er, 58);
    }

    return undefined;
};

export const find_from_val = (array, val) => {
    try {
        return array.find(item => (item.val || item.value) === val);

    } catch (er) {
        err(er, 59);
    }

    return undefined;
};

export const val_is_localized = val => {
    try {
        return val.indexOf('__MSG_') > -1;

    } catch (er) {
        err(er, 60);
    }

    return undefined;
};

export const get_message_name = val => {
    try {
        return val.replace(/__MSG_|__/g, '');

    } catch (er) {
        err(er, 61);
    }

    return undefined;
};

export const deselect_theme = action(() => {
    try {
        ob.chosen_folder_path = choose_folder.ob.work_folder;

        reset_inputs_data();

    } catch (er) {
        err(er, 62);
    }
});

export const construct_icons_obj = json => {
    try {
        const new_json = json;

        if (!json.icons) {
            new_json.icons = {};
        }

        if (!json['128']) {
            new_json['128'] = {};
        }

    } catch (er) {
        err(er, 64);
    }
};

export const write_to_json = (json, json_path) => {
    try {
        writeJsonSync(json_path, json, { spaces: 4 });

    } catch (er) {
        err(er, 65, null, false, false, true);
    }
};

export const get_icon_paths = () => {
    try {
        const default_icon_soure_path = resolve('resources', 'app', 'bundle', 'new_theme', 'icon.png');
        const default_icon_target_path = resolve(ob.chosen_folder_path, 'icon.png');

        return {
            source: default_icon_soure_path,
            target: default_icon_target_path,
        };

    } catch (er) {
        err(er, 66);
    }

    return undefined;
};

//> varibles t
export const ob = observable({
    chosen_folder_path: choose_folder.ob.work_folder,
});

export const mut = {
    manifest: null,
};
//< varibles t

const { reset_inputs_data } = require('js/inputs_data');
