import { existsSync, readdirSync, statSync } from 'fs-extra';
import { join } from 'path';

import { observable, action, configure } from 'mobx';

import { reset_inputs_data } from 'js/inputs_data';
import * as chosen_folder_path from 'js/chosen_folder_path';
import * as choose_folder from 'js/work_folder/choose_folder';
import * as expand_or_collapse from 'js/work_folder/expand_or_collapse';

configure({ enforceActions: 'observed' });

export const check_if_selected_folder_is_theme = callback => {
    try {
        if (choose_folder.reset_work_folder(false)) {
            const folder_is_theme = check_if_folder_is_theme(chosen_folder_path.ob.chosen_folder_path);

            if (folder_is_theme) {
                callback();

            } else {
                err(er_obj('Chosen folder is not a theme'), 3, 'chosen_folder_is_not_theme');
            }
        }

    } catch (er) {
        err(er, 16);
    }
};

export const check_if_multiple_themes_is_selected = (return_result, callback) => {
    try {
        const number_of_themes = chosen_folder_path.ob.chosen_folder_bulk_paths.filter(path => check_if_folder_is_theme(path)).length;
        const one_bulk_theme_is_also_chosen_as_main_theme = chosen_folder_path.ob.chosen_folder_bulk_paths.some(path => path === chosen_folder_path.ob.chosen_folder_path);

        if ((one_bulk_theme_is_also_chosen_as_main_theme && number_of_themes >= 2) || (!one_bulk_theme_is_also_chosen_as_main_theme && number_of_themes >= 1)) {
            if (return_result) {
                return true;
            }

            callback();

        } else {
            if (return_result) {
                return false;
            }

            err(er_obj('Wrong bulk theme selection'), 274, 'wrong_bulk_theme_selection');
        }

    } catch (er) {
        err(er, 272);
    }

    return undefined;
};

export const check_if_at_least_one_theme_is_selected = callback => {
    try {
        if (choose_folder.reset_work_folder(false)) {
            const at_least_on_theme_is_selected = check_if_folder_is_theme(chosen_folder_path.ob.chosen_folder_path) || chosen_folder_path.ob.chosen_folder_bulk_paths.some(path => check_if_folder_is_theme(path));

            if (at_least_on_theme_is_selected) {
                callback();

            } else {
                err(er_obj('No theme is selected'), 283, 'no_themes_is_selected');
            }
        }

    } catch (er) {
        err(er, 284);
    }
};


export const check_if_folder_is_theme = folder_path => {
    try {
        const manifest_path = join(folder_path, 'manifest.json');
        const is_theme = existsSync(manifest_path);

        return is_theme;

    } catch (er) {
        err(er, 273);
    }

    return undefined;
};

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
        if (existsSync(folder_path)) {
            const files = readdirSync(folder_path);

            return files.map(file => {
                const child_path = join(folder_path, file);

                if (existsSync(child_path)) {
                    return {
                        name: file,
                        path: child_path,
                        is_directory: statSync(join(folder_path, file)).isDirectory(),
                    };
                }

                return null;
            }).filter(file => file);
        }

    } catch (er) {
        err(er, 90);
    }

    return undefined;
};


export const get_info_about_folder = folder_path => {
    try {
        const folder_info = {};
        const folder_exist = existsSync(folder_path);
        const getting_info_about_work_folder = folder_path === choose_folder.ob.work_folder;

        if (getting_info_about_work_folder) {
            folder_info.children = ob.folders.filter(item => item.nest_level === 0);

        } else {
            folder_info.children = get_folders(folder_path);
        }

        if (folder_exist && folder_info.children) {
            folder_info.is_theme = existsSync(join(folder_path, 'manifest.json'));
            folder_info.is_empty = !folder_info.children.some(item => {
                const folder_stat = existsSync(item.path) ? statSync(item.path) : null;

                if (folder_stat) {
                    return folder_stat.isDirectory();

                }

                return false;
            });

        } else {
            folder_info.is_theme = false;
            folder_info.is_empty = true;
        }

        return folder_info;

    } catch (er) {
        err(er, 91);
    }

    return undefined;
};

export const get_number_of_folders_to_work_with = (start_i, nest_level) => {
    try {
        const no_preceding_folders = ob.folders.filter((item, i) => i >= start_i);

        return no_preceding_folders.findIndex(item => item.nest_level < nest_level || item === ob.folders[ob.folders.length - 1]);

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

                expand_or_collapse.expand_or_collapse_folder('arrow', ob.folders[i].path, ob.folders[i].nest_level + 1);

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

export const find_file_name_by_element_name = (name, target_folder_path) => {
    try {
        if (chosen_folder_path.ob.chosen_folder_path) {
            const files = readdirSync(target_folder_path || chosen_folder_path.ob.chosen_folder_path);
            const file_name = files.find(file => file.indexOf(`${name}.`) > -1);

            return file_name;
        }

    } catch (er) {
        err(er, 310);
    }

    return undefined;
};

export const get_folder_i = folder_path => ob.folders.findIndex(cur_folder => cur_folder.path === folder_path);

export const ob = observable({
    folders: [],
});

export const mut = {
    opened_folders: [],
    chosen_folder_info: {},
};
