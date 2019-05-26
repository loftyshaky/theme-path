import { join } from 'path';
import { existsSync } from 'fs-extra';

import { action, configure } from 'mobx';
import looksSame from 'looks-same';

import { inputs_data, reset_inputs_data } from 'js/inputs_data';
import * as manifest from 'js/manifest';
import * as chosen_folder_path from 'js/chosen_folder_path';
import * as icons from 'js/icons';
import * as msg from 'js/msg';
import * as json_file from 'js/json_file';
import * as tutorial from 'js/tutorial';
import * as analytics from 'js/analytics';
import * as folders from 'js/work_folder/folders';
import * as expand_or_collapse from 'js/work_folder/expand_or_collapse';
import * as convert_color from 'js/convert_color';
import * as choose_folder from 'js/work_folder/choose_folder';
import * as color_pickiers from 'js/color_pickiers';
import * as picked_colors from 'js/picked_colors';
import * as history from 'js/history';
import * as change_val from 'js/change_val';

configure({ enforceActions: 'observed' });

//> select folder and fill inputs with theme data
export const select_folder = action((is_work_folder, folder_path, children, nest_level, i_to_insert_folder_in) => { // action( need to be here otherwise protecting screen will not lift
    try {
        if (choose_folder.reset_work_folder(false)) {
            const folder_is_already_selected = folder_path === chosen_folder_path.ob.chosen_folder_path;

            if (!is_work_folder) {
                folders.deselect_theme();
            }

            chosen_folder_path.set_chosen_folder_path(folder_path);

            const folder_info = folders.get_info_about_folder(folder_path);

            if (!is_work_folder) {
                folders.ob.folders[i_to_insert_folder_in - 1].is_theme = folder_info.is_theme;
                folders.ob.folders[i_to_insert_folder_in - 1].is_empty = folder_info.is_empty;

                folders.rerender_work_folder();
            }

            if (folder_info.is_theme) {
                reset_inputs_data();

                manifest.mut.manifest = json_file.parse_json(join(folder_path, 'manifest.json'));
                const { default_locale } = manifest.mut.manifest;

                get_theme_name_or_descrption_inner(folder_path, default_locale, default_locale);

                set_val('theme_metadata', 'locale', default_locale);

                const picked_colors_path = join(chosen_folder_path.ob.chosen_folder_path, picked_colors.con.picked_colors_sdb_path);

                const picked_colors_obj = existsSync(picked_colors_path) ? json_file.parse_json(picked_colors_path) : null;

                if (picked_colors_obj && picked_colors_obj.theme_metadata && picked_colors_obj.theme_metadata.icon) {
                    color_pickiers.set_color_input_vizualization_color('theme_metadata', 'icon', picked_colors_obj.theme_metadata.icon, true);
                }

                if (manifest.mut.manifest.theme) {
                    Object.entries(manifest.mut.manifest.theme).forEach(([family, family_obj]) => {
                        Object.entries(family_obj).forEach(([name, val]) => {
                            set_val(family, name, val);
                            if (picked_colors_obj && picked_colors_obj[family] && picked_colors_obj[family][name]) {
                                color_pickiers.set_color_input_vizualization_color(family, name, picked_colors_obj[family][name], true);
                            }
                        });
                    });
                }

                //> set icon default checkbox state
                if (manifest.mut.manifest.icons && manifest.mut.manifest.icons['128']) {
                    const icon_paths = icons.get_icon_paths();

                    if (existsSync(icon_paths.target)) {
                        looksSame(icon_paths.source, icon_paths.target, (er2, using_default_icon) => {
                            if (er2) {
                                err(er2, 82);
                            }

                            if (!using_default_icon.equal) {
                                uncheck_icon_input_default_checkbox();
                            }
                        });

                    } else {

                        uncheck_icon_input_default_checkbox();
                    }
                }
                //< set icon default checkbox state

                if (!is_work_folder) {
                    expand_or_collapse.expand_or_collapse_folder('select', folder_path, nest_level, i_to_insert_folder_in);
                }

                if (tutorial.ob.tutorial_stage === 4) {
                    tutorial.increment_tutorial_stage(false, true);
                }

            } else if (tutorial.ob.tutorial_stage === 2) {
                tutorial.increment_tutorial_stage(false, true);
            }

            convert_color.convert_all();

            folders.mut.chosen_folder_info = {
                children: children || null,
                is_theme: folder_info.is_theme,
                nest_level: nest_level || null,
                i_to_insert_folder_in: i_to_insert_folder_in || null,
            };

            if (!folder_is_already_selected) {
                if (folder_info.is_theme) {
                    analytics.add_work_folder_analytics('selected_theme');

                } else {
                    analytics.add_work_folder_analytics('selected_folder');
                }
            }
        }

    } catch (er) {
        err(er, 13);
    }
});

export const get_theme_name_or_descrption_inner = (folder_path, locale, default_locale) => {
    try {
        Object.entries(manifest.mut.manifest).forEach(([name, val]) => {
            if (inputs_data.obj.theme_metadata[name]) {
                const val_is_localized = msg.val_is_localized(val);

                if (val_is_localized) {
                    const message_name = msg.get_message_name(val);

                    get_theme_name_or_descrption(name, message_name, locale, default_locale, folder_path);

                } else {
                    set_val('theme_metadata', name, val);
                }
            }
        });

    } catch (er) {
        err(er, 78);
    }
};

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

const set_val = action((family, name, val) => {
    try {
        const item = inputs_data.obj[family] ? inputs_data.obj[family][name] : null;

        if (item) {
            item.val = name === 'ntp_logo_alternate' ? val.toString() : val;

            if (history.textareas_cond(family, name)) {
                change_val.set_previous_val(family, name, val);
            }
        }

    } catch (er) {
        err(er, 80);
    }
});

const uncheck_icon_input_default_checkbox = action(() => {
    try {
        inputs_data.obj.theme_metadata.icon.default = false;

    } catch (er) {
        err(er, 81);
    }
});
//< select folder and fill inputs with theme data;
