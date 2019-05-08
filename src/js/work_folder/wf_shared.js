import { existsSync, readdirSync, statSync } from 'fs-extra';
import { join } from 'path';

import { decorate, observable, action, computed, configure } from 'mobx';
import * as r from 'ramda';

import { reset_inputs_data } from 'js/inputs_data';
import * as chosen_folder_path from 'js/chosen_folder_path';
import * as toggle_popup from 'js/toggle_popup';
import * as help_viewer from 'js/help_viewer';
import * as choose_folder from 'js/work_folder/choose_folder';
import * as expand_or_collapse from 'js/work_folder/expand_or_collapse';

configure({ enforceActions: 'observed' });

//--

export const rerender_work_folder = action(() => {
    try {
        const previous_val = chosen_folder_path.ob.chosen_folder_path;
        chosen_folder_path.ob.chosen_folder_path = '';
        chosen_folder_path.ob.chosen_folder_path = previous_val;

    } catch (er) {
        err(er, 89);
    }
});

export const get_folders = folder_path => {
    try {
        const files = readdirSync(folder_path);

        return files.map(file => {
            const child_path = join(folder_path, file);

            return {
                name: file,
                path: child_path,
                is_directory: statSync(join(folder_path, file)).isDirectory(),
            };
        });

    } catch (er) {
        err(er, 90);
    }

    return undefined;
};


export const get_info_about_folder = folder_path => {
    try {
        const folder_info = {};

        if (!existsSync(folder_path)) {
            folder_info.is_theme = false;
            folder_info.is_empty = true;

        } else {
            folder_info.children = get_folders(folder_path);
            folder_info.is_theme = folder_info.children.some(item => item.name === 'manifest.json');
            folder_info.is_empty = !folder_info.children.some(item => statSync(item.path).isDirectory());
        }

        return folder_info;

    } catch (er) {
        err(er, 91);
    }

    return undefined;
};

export const get_number_of_folders_to_work_with = (start_i, nest_level) => {
    try {
        const close_preceding_folder = r.drop(start_i);
        const get_last_folder_to_close_i = r.findIndex(item => item.nest_level < nest_level || item === ob.folders[ob.folders.length - 1]);

        return r.pipe(close_preceding_folder, get_last_folder_to_close_i)(ob.folders);

    } catch (er) {
        err(er, 92);
    }

    return undefined;
};

export const collapse_all_folders = () => {
    try {
        const at_least_one_folder_is_open = mut.opened_folders[1];

        if (at_least_one_folder_is_open) {
            if (mut.opened_folders[1] !== choose_folder.ob.work_folder) {
                const i = ob.folders.findIndex(cur_folder => cur_folder.path === mut.opened_folders[1]);

                expand_or_collapse.expand_or_collapse_folder('arrow', ob.folders[i].path, ob.folders[i].nest_level + 1, i + 1);

                if (mut.opened_folders[1]) {
                    collapse_all_folders();
                }
            }
        }

    } catch (er) {
        err(er, 147);
    }
};

export const set_folders = action(val => {
    ob.folders = val;
});

export const deselect_theme = action(() => {
    try {
        chosen_folder_path.ob.chosen_folder_path = choose_folder.ob.work_folder;

        mut.chosen_folder_info.is_theme = false;

        reset_inputs_data();

    } catch (er) {
        err(er, 62);
    }
});

//> varibles t
export const ob = observable({
    folders: [],
});

export const com = {
    get fieldset_protecting_screen_is_visible() {
        const work_folder_path = choose_folder.ob.work_folder;

        if (work_folder_path === chosen_folder_path.ob.chosen_folder_path) {
            const work_folder_info = get_info_about_folder(work_folder_path);

            return !work_folder_info.is_theme;

        }

        return !mut.chosen_folder_info.is_theme; // if any folder in work folder selected
    },
};

export const com2 = {
    get inputs_disabled_1() {
        return com.fieldset_protecting_screen_is_visible || toggle_popup.ob.protecting_screen_is_visible || help_viewer.ob.help_viewer_is_visible ? -1 : 0;
    },
    get inputs_disabled_2() {
        return (com.fieldset_protecting_screen_is_visible || toggle_popup.ob.protecting_screen_is_visible || help_viewer.ob.help_viewer_is_visible) || false;
    },
    get inputs_disabled_3() {
        return toggle_popup.ob.protecting_screen_is_visible || help_viewer.ob.help_viewer_is_visible ? -1 : 0;
    },
    get inputs_disabled_4() {
        return (toggle_popup.ob.protecting_screen_is_visible || help_viewer.ob.help_viewer_is_visible) || false;
    },
    get inputs_disabled_5() {
        return help_viewer.ob.help_viewer_is_visible || false;
    },
};

export const mut = {
    opened_folders: [],
    chosen_folder_info: {},
};
//< varibles t

decorate(com, {
    fieldset_protecting_screen_is_visible: computed,
});

decorate(com2, {
    inputs_disabled_1: computed,
    inputs_disabled_2: computed,
});
