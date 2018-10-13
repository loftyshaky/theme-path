
'use strict';

import { observable, configure } from "mobx";

configure({ enforceActions: 'observed' });

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

//> varibles t
export const ob = observable({
    chosen_folder_path: ''
});

export const mut = {
    manifest: null
};
//< varibles t