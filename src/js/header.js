import * as open_and_pack from 'js/open_and_pack';
import * as toggle_popup from 'js/toggle_popup';
import * as expand_or_collapse from 'js/work_folder/expand_or_collapse';

export const pack = (name) => {
    try {
        open_and_pack.pack(name);
    } catch (er) {
        err(er, 167);
    }
};

export const toggle_popup_f = (name) => {
    try {
        toggle_popup.toggle_popup(name);
    } catch (er) {
        err(er, 166);
    }
};

export const create_custom_folder = (folder_path) => {
    try {
        expand_or_collapse.create_new_theme_or_folder(folder_path);
    } catch (er) {
        err(er, 166);
    }
};
