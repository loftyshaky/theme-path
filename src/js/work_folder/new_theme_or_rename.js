import { join, dirname, sep } from 'path';
import { existsSync, copySync, renameSync } from 'fs-extra';

import { action, configure } from 'mobx';

import x from 'x';
import * as chosen_folder_path from 'js/chosen_folder_path';
import * as tutorial from 'js/tutorial';
import * as folders from 'js/work_folder/folders';
import * as choose_folder from 'js/work_folder/choose_folder';
import * as els_state from 'js/els_state';

configure({ enforceActions: 'observed' });

//> create new theme when clicking on "New theme" or rename theme folder when typing in name input
export const create_new_theme_or_rename_theme_folder = action((mode, folder_path, nest_level, start_i, folder_is_opened, name_input_val, custom_folder_path) => { // action( need to be here otherwise renamed folder will be deselected
    try {
        if (choose_folder.reset_work_folder(false)) {
            if (mode === 'renaming_folder' || (mode === 'creating_folder' && !folders.mut.chosen_folder_info.is_theme)) {
                const custom_or_new_theme_folder_name = custom_folder_path ? custom_folder_path.substring(custom_folder_path.lastIndexOf(sep) + 1) : x.msg('new_theme_folder_name_text');
                const folder_name = mode === 'renaming_folder' ? name_input_val : custom_or_new_theme_folder_name;
                const timne_id = Date.now();
                const folder_to_create_path = custom_folder_path || join(app_root, 'resources', 'app', 'bundle', 'new_theme');
                const source_folder_path = mode === 'renaming_folder' ? folder_path : folder_to_create_path;
                const parent_of_renamed_folder_path = dirname(folder_path);

                for (let i = 0; i < 22; i++) {
                    const unique_identifier = i < 21 ? i : timne_id;
                    const folder_name_final = folder_name + (i !== 0 ? ` (${unique_identifier})` : '');

                    try {
                        if (!existsSync(join(folder_path, folder_name_final))) {
                            if (mode === 'creating_folder') {
                                const new_theme_path = join(folder_path, folder_name_final);
                                mut.path_of_folder_to_put_first = new_theme_path;

                                copySync(source_folder_path, new_theme_path);

                                if (tutorial.ob.tutorial_stage === 3) {
                                    tutorial.increment_tutorial_stage(false, true);
                                }

                            } else if (mode === 'renaming_folder' && folder_name_final.length <= 255) {
                                const new_folder_path = join(parent_of_renamed_folder_path, folder_name_final);

                                try {
                                    if (existsSync(source_folder_path)) {
                                        renameSync(source_folder_path, new_folder_path);
                                    }

                                } catch (er) {
                                    err(er, 9, 'folder_is_locked');
                                    t('folder_is_locked'); // eslint-disable-line no-throw-literal
                                }

                                chosen_folder_path.set_chosen_folder_path(new_folder_path);

                                const renamed_folder_i = folders.ob.folders.findIndex(item => item.path === source_folder_path);
                                const work_folder_is_theme_folder = folders.ob.folders.length === 0;

                                if (!work_folder_is_theme_folder) {
                                    folders.ob.folders[renamed_folder_i].name = folder_name_final;
                                    folders.ob.folders[renamed_folder_i].path = new_folder_path;

                                } else {
                                    choose_folder.change_work_folder(new_folder_path);
                                }

                                els_state.set_applying_textarea_val_val(false);
                            }

                        } else {
                            err(er_obj('Found folder with the same name or named empty'), 9, null, true);
                            t('found_folder_with_the_same_name_or_named_empty'); // eslint-disable-line no-throw-literal
                        }

                        break;

                    } catch (er) {
                        if (er.message === 'folder_is_locked') {
                            break;

                        } else if (er.message !== 'found_folder_with_the_same_name_or_named_empty') {
                            err(er, 20);
                        }
                    }
                }
            } else if (mode === 'creating_folder') {
                err(er_obj('Cant create theme in theme'), 125, 'cant_create_theme_in_theme');
            }
        }

    } catch (er) {
        err(er, 77);
    }
});

export const rename_theme_folder = x.debounce((folder_path, name_input_val) => create_new_theme_or_rename_theme_folder('renaming_folder', folder_path, null, null, null, name_input_val), 1000);
//< create new theme when clicking on "New theme" or rename theme folder when typing in name input

export const put_new_folder_first = parent_folder_path => {
    try {
        if (mut.path_of_folder_to_put_first) {
            const folder_to_put_first_i = folders.ob.folders.findIndex(folder => folder.path === mut.path_of_folder_to_put_first);
            const parent_folder_i = folders.ob.folders.findIndex(folder => folder.path === parent_folder_path);

            x.move_a_item(folders.ob.folders, folder_to_put_first_i, parent_folder_i === -1 ? 0 : parent_folder_i + 1);

            mut.path_of_folder_to_put_first = null;
        }

    } catch (er) {
        err(er, 230);
    }
};


export const mut = {
    path_of_folder_to_put_first: null,
};
