'use strict';


import { observable, configure } from "mobx";
import * as r from 'ramda';

configure({ enforceActions: 'observed' });

export const get_number_of_folders_to_work_with = (start_i, nest_level) => {
    const close_preceding_folder = r.drop(start_i);
    const get_last_folder_to_close_i = r.findIndex(item => item.nest_level < nest_level || item == ob.folders[ob.folders.length - 1]); // item == wf_shared.ob.folders[wf_shared.ob.folders.length - 1] if last folder
    return r.pipe(close_preceding_folder, get_last_folder_to_close_i)(ob.folders);
};

//> varibles t
export const ob = observable({
    folders: []
});
//< varibles t