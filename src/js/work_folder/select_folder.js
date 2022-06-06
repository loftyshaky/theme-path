import { join, sep } from 'path';
import { existsSync } from 'fs-extra';
import recursiveReaddir from 'recursive-readdir';

import { action, runInAction } from 'mobx';
import looksSame from 'looks-same';

import { inputs_data, reset_inputs_data } from 'js/inputs_data';
import * as manifest from 'js/manifest';
import * as chosen_folder_path from 'js/chosen_folder_path';
import * as icons from 'js/icons';
import * as msg from 'js/msg';
import * as json_file from 'js/json_file';
import * as tutorial from 'js/tutorial';
import * as enter_click from 'js/enter_click';
import * as folders from 'js/work_folder/folders';
import * as expand_or_collapse from 'js/work_folder/expand_or_collapse';
import * as convert_color from 'js/convert_color';
import * as choose_folder from 'js/work_folder/choose_folder';
import * as color_pickiers from 'js/color_pickiers';
import * as picked_colors from 'js/picked_colors';
import * as conds from 'js/conds';
import * as change_val from 'js/change_val';
import * as reupload_img from 'js/reupload_img';
import * as imgs from 'js/imgs';

export const select_bulk_by_ctrl_clicking_on_folder = async (folder_path) => {
    const files = await recursiveReaddir(folder_path);
    const chosen_folder_path_is_already_selected =
        chosen_folder_path.check_if_folder_is_bulk_selected(folder_path);
    const manifest_files_paths = files.filter((file) => file.indexOf('manifest.json') > -1);
    const theme_paths = manifest_files_paths.map((path) => path.substr(0, path.lastIndexOf(sep)));
    const at_least_one_theme_in_chosen_folder_is_selected = theme_paths.some((path) =>
        chosen_folder_path.check_if_folder_is_bulk_selected(path),
    );
    const all_themes_in_chosen_folder_is_selected = theme_paths.every((path) =>
        chosen_folder_path.check_if_folder_is_bulk_selected(path),
    );
    const chosen_folder_doesnt_contain_themes = theme_paths.length === 0;
    const force_remove =
        chosen_folder_path_is_already_selected &&
        (at_least_one_theme_in_chosen_folder_is_selected ||
            !all_themes_in_chosen_folder_is_selected ||
            chosen_folder_doesnt_contain_themes);

    for (const theme_path of theme_paths) {
        if (force_remove) {
            chosen_folder_path.set_chosen_folder_bulk_path('force_remove', theme_path);
        } else if (!chosen_folder_path.check_if_folder_is_bulk_selected(theme_path)) {
            chosen_folder_path.set_chosen_folder_bulk_path('force_add', theme_path);
        }
    }

    if (force_remove) {
        chosen_folder_path.set_chosen_folder_bulk_path('force_remove', folder_path);
    } else {
        chosen_folder_path.set_chosen_folder_bulk_path('force_add', folder_path);
    }

    chosen_folder_path.count_bulk_themes();
};

const set_val = action((family, name, val) => {
    try {
        const item = inputs_data.obj[family] ? inputs_data.obj[family][name] : null;

        if (item) {
            item.val = name === 'ntp_logo_alternate' ? val.toString() : val;

            if (conds.textareas(family, name)) {
                change_val.set_previous_val(family, name, val);
            }
        }
    } catch (er) {
        err(er, 80);
    }
});

const get_theme_name_or_descrption = (name, message_name, locale, default_locale, folder_path) => {
    try {
        const messages_path = join(folder_path, '_locales', locale, 'messages.json');
        const messages_file_exist = existsSync(messages_path);
        let val = '';

        if (messages_file_exist) {
            const name_exist = json_file.parse_json(messages_path)[message_name]; // name ex: description, name

            if (name_exist) {
                val = json_file.parse_json(messages_path)[message_name].message;
            }
        }

        set_val('theme_metadata', name, val);
    } catch (er) {
        err(er, 79);
    }
};

export const get_theme_name_or_descrption_inner = (folder_path, locale, default_locale) => {
    try {
        Object.entries(manifest.mut.manifest).forEach(([name, val]) => {
            if (inputs_data.obj.theme_metadata[name]) {
                const val_is_localized = msg.val_is_localized(val);

                if (val_is_localized) {
                    const message_name = msg.get_message_name(val);

                    get_theme_name_or_descrption(
                        name,
                        message_name,
                        locale,
                        default_locale,
                        folder_path,
                    );
                } else {
                    set_val('theme_metadata', name, val);
                }
            }
        });
    } catch (er) {
        err(er, 78);
    }
};

const uncheck_icon_input_default_checkbox = action(() => {
    try {
        inputs_data.obj.theme_metadata.icon.default = false;
    } catch (er) {
        err(er, 81);
    }
});
//< select folder and fill inputs with theme data;

//> select folder and fill inputs with theme data
export const select_folder = async (is_work_folder, folder_path, children, nest_level, e) => {
    try {
        if (choose_folder.reset_work_folder(false)) {
            const folder_info = folders.get_info_about_folder(folder_path);

            if (
                (e.type === 'auxclick' && e.button === 2) ||
                (e.type === 'keyup' &&
                    e.keyCode === enter_click.con.enter_key_code &&
                    (e.ctrlKey || e.shiftKey))
            ) {
                if (folder_info.is_theme) {
                    chosen_folder_path.set_chosen_folder_bulk_path('decide', folder_path);

                    chosen_folder_path.count_bulk_themes();
                } else if (!folder_info.is_theme) {
                    await select_bulk_by_ctrl_clicking_on_folder(folder_path);
                }
            } else if (
                (e.type === 'click' && e.button === 0) ||
                (e.type === 'keyup' && e.keyCode === enter_click.con.enter_key_code)
            ) {
                runInAction(() => {
                    // runInAction( need to be here otherwise protecting screen will not lift
                    const i_to_insert_folder_in = folders.get_folder_i(folder_path) + 1;

                    if (!is_work_folder) {
                        folders.deselect_theme();
                    }

                    chosen_folder_path.set_chosen_folder_path(folder_path);

                    if (!is_work_folder) {
                        folders.ob.folders[i_to_insert_folder_in - 1].is_theme =
                            folder_info.is_theme;
                        folders.ob.folders[i_to_insert_folder_in - 1].is_empty =
                            folder_info.is_empty;

                        folders.rerender_work_folder();
                    }

                    if (folder_info.is_theme) {
                        reset_inputs_data();

                        manifest.mut.manifest = json_file.parse_json(
                            join(folder_path, 'manifest.json'),
                        );
                        const { default_locale } = manifest.mut.manifest;

                        get_theme_name_or_descrption_inner(
                            folder_path,
                            default_locale,
                            default_locale,
                        );

                        set_val('theme_metadata', 'locale', default_locale);

                        const picked_colors_obj = picked_colors.get_picked_colors_obj();

                        if (
                            picked_colors_obj &&
                            picked_colors_obj.theme_metadata &&
                            picked_colors_obj.theme_metadata.icon
                        ) {
                            color_pickiers.set_color_input_vizualization_color(
                                'theme_metadata',
                                'icon',
                                picked_colors_obj.theme_metadata.icon,
                            );
                        }

                        if (manifest.mut.manifest.theme) {
                            Object.entries(manifest.mut.manifest.theme).forEach(
                                ([family, family_obj]) => {
                                    Object.entries(family_obj).forEach(([name, val]) => {
                                        set_val(family, name, val);

                                        if (
                                            picked_colors_obj &&
                                            picked_colors_obj[family] &&
                                            picked_colors_obj[family][name]
                                        ) {
                                            color_pickiers.set_color_input_vizualization_color(
                                                family,
                                                name,
                                                picked_colors_obj[family][name],
                                            );
                                        }

                                        imgs.get_dims(family, name);
                                    });
                                },
                            );
                        }

                        imgs.get_dims('theme_metadata', 'icon');

                        //> set icon default checkbox state
                        if (manifest.mut.manifest.icons && manifest.mut.manifest.icons['128']) {
                            const icon_paths = icons.get_icon_paths();

                            if (existsSync(icon_paths.target)) {
                                looksSame(
                                    icon_paths.source,
                                    icon_paths.target,
                                    (er2, using_default_icon) => {
                                        if (er2) {
                                            err(er2, 82);
                                        }

                                        if (!using_default_icon.equal) {
                                            uncheck_icon_input_default_checkbox();
                                        }
                                    },
                                );
                            } else {
                                uncheck_icon_input_default_checkbox();
                            }
                        }
                        //< set icon default checkbox state

                        if (!is_work_folder) {
                            expand_or_collapse.expand_or_collapse_folder(
                                'select',
                                folder_path,
                                nest_level,
                            );
                        }

                        if (tutorial.ob.tutorial_stage === 4) {
                            tutorial.increment_tutorial_stage(false);
                        }
                    } else if (tutorial.ob.tutorial_stage === 2) {
                        tutorial.increment_tutorial_stage(false);
                    }

                    convert_color.convert_all();

                    folders.mut.chosen_folder_info = {
                        children: children || null,
                        is_theme: folder_info.is_theme,
                        nest_level: nest_level || null,
                        i_to_insert_folder_in: i_to_insert_folder_in || null,
                    };

                    reupload_img.set_current_previous_img_path_ob();
                });

                chosen_folder_path.count_bulk_themes();
            }
        }
    } catch (er) {
        err(er, 13);
    }
};
