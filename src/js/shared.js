
'use strict';

import { observable, configure } from "mobx";

configure({ enforceActions: 'observed' });

export const find_from_name = (array, name) => {
    return array.find(item => item.name === name);
};

export const find_from_val = (array, val) => {
    return array.find(item => item.val === val);
};

//> varibles t
export const ob = observable({
    chosen_folder_path: ''
});

export const mut = {
    manifest: null
};
//< varibles t