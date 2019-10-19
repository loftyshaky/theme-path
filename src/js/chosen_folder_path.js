import { action, observable, configure } from 'mobx';

import * as folders from 'js/work_folder/folders';
import * as choose_folder from 'js/work_folder/choose_folder';

configure({ enforceActions: 'observed' });

export const set_chosen_folder_path = action(chosen_folder_path => {
    try {
        ob.chosen_folder_path = chosen_folder_path;

    } catch (er) {
        err(er, 56);
    }
});

export const set_chosen_folder_bulk_path = action((mode, chosen_folder_path) => {
    try {
        const folder_path_to_deselect_index = ob.chosen_folder_bulk_paths.indexOf(chosen_folder_path);
        const chosen_folder_is_already_selected = folder_path_to_deselect_index > -1;

        if ((!chosen_folder_is_already_selected && mode === 'decide') || mode === 'force_add') {
            ob.chosen_folder_bulk_paths.push(chosen_folder_path);

        } else if (mode === 'decide' || mode === 'force_remove') {
            ob.chosen_folder_bulk_paths.splice(folder_path_to_deselect_index, 1);
        }

    } catch (er) {
        err(er, 251);
    }
});


export const rename_chosen_folder_bulk_path = (old_name, new_name) => {
    try {
        const folder_name_i = ob.chosen_folder_bulk_paths.indexOf(old_name);

        ob.chosen_folder_bulk_paths[folder_name_i] = new_name;

    } catch (er) {
        err(er, 279);
    }
};

export const check_if_folder_is_bulk_selected = folder_path => {
    try {
        return ob.chosen_folder_bulk_paths.indexOf(folder_path) > -1;

    } catch (er) {
        err(er, 252);
    }

    return undefined;
};


export const exclude_non_themes = () => {
    try {
        return ob.chosen_folder_bulk_paths.filter(path => path !== ob.chosen_folder_path && folders.check_if_folder_is_theme(path));

    } catch (er) {
        err(er, 288);
    }

    return undefined;
};

export const count_bulk_themes = action(() => {
    try {
        const themes = exclude_non_themes(ob.chosen_folder_bulk_paths);

        ob.bulk_theme_count = themes.filter(path => path !== ob.chosen_folder_path).length;

    } catch (er) {
        err(er, 291);
    }
});

export const deselect_all_bulk_folders = action(() => {
    try {
        ob.chosen_folder_bulk_paths = [];
        ob.bulk_theme_count = 0;

    } catch (er) {
        err(er, 309);
    }
});


export const ob = observable({
    chosen_folder_path: choose_folder.ob.work_folder,
    chosen_folder_bulk_paths: [],
    bulk_theme_count: 0,
});

export const mut = {
    confirm_breakpoint: 10,
};
