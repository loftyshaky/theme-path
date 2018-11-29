import { join } from 'path';
import { existsSync } from 'fs-extra';

import { action, configure } from 'mobx';
import looksSame from 'looks-same';

import { inputs_data, reset_inputs_data } from 'js/inputs_data';
import * as shared from 'js/shared';
import * as wf_shared from 'js/work_folder/wf_shared';
import * as expand_or_collapse from 'js/work_folder/expand_or_collapse';
import * as convert_color from 'js/convert_color';
import * as choose_folder from 'js/work_folder/choose_folder';

configure({ enforceActions: 'observed' });

//--

//> select folder and fill inputs with theme data
export const select_folder = action((is_work_folder, folder_path, children, nest_level, i_to_insert_folfder_in) => { // action( need to be here otherwise protecting screen will not lift
    try {
        if (choose_folder.reset_work_folder(false)) {
            if (!is_work_folder) {
                shared.deselect_theme();
            }

            shared.set_chosen_folder_path(folder_path);

            const folder_info = wf_shared.get_info_about_folder(folder_path);

            if (!is_work_folder) {
                wf_shared.ob.folders[i_to_insert_folfder_in - 1].is_theme = folder_info.is_theme;
                wf_shared.ob.folders[i_to_insert_folfder_in - 1].is_empty = folder_info.is_empty;

                wf_shared.rerender_work_folder();
            }

            if (folder_info.is_theme) {
                reset_inputs_data();

                shared.mut.manifest = shared.parse_json(join(folder_path, 'manifest.json'));
                const { default_locale } = shared.mut.manifest;

                get_theme_name_or_descrption_inner(folder_path, default_locale, default_locale);

                set_val('theme_metadata', 'locale', default_locale);

                if (shared.mut.manifest.theme) {
                    Object.entries(shared.mut.manifest.theme).forEach(([family, family_obj]) => {
                        Object.entries(family_obj).forEach(([name, val]) => {
                            set_val(family, name, val);
                        });
                    });
                }

                //> set icon default checkbox state
                if (shared.mut.manifest.icons && shared.mut.manifest.icons['128']) {
                    const icon_paths = shared.get_icon_paths();

                    if (existsSync(icon_paths.target)) {
                        looksSame(icon_paths.source, icon_paths.target, (er2, using_default_icon) => {
                            if (er2) {
                                err(er2, 82);
                            }

                            if (!using_default_icon) {
                                uncheck_icon_input_default_checkbox();
                            }
                        });

                    } else {
                        uncheck_icon_input_default_checkbox();
                    }
                }
                //< set icon default checkbox state

                if (!is_work_folder) {
                    expand_or_collapse.expand_or_collapse_folder('select', folder_path, nest_level, i_to_insert_folfder_in);
                }
            }

            convert_color.convert_all();

            wf_shared.ob.chosen_folder_info = {
                children: children || null,
                is_theme: folder_info.is_theme,
                nest_level: nest_level || null,
                i_to_insert_folfder_in: i_to_insert_folfder_in || null,
            };
        }

    } catch (er) {
        err(er, 13);
    }
});

export const get_theme_name_or_descrption_inner = (folder_path, locale, default_locale) => {
    try {
        Object.entries(shared.mut.manifest).forEach(([name, val]) => {
            const item = shared.find_from_name(inputs_data.obj.theme_metadata, name);

            if (item) {
                const val_is_localized = shared.val_is_localized(val);

                if (val_is_localized) {
                    const message_name = shared.get_message_name(val);

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
            const name_exist = shared.parse_json(messages_path)[message_name]; // name ex: description, name

            if (name_exist) {
                val = shared.parse_json(messages_path)[message_name].message;
            }
        }

        set_val('theme_metadata', name, val);

    } catch (er) {
        err(er, 79);
    }
};

const set_val = action((family, name, val) => {
    try {
        const item = shared.find_from_name(inputs_data.obj[family], name);

        if (item) {
            item.val = name === 'ntp_logo_alternate' ? val.toString() : val;
        }

    } catch (er) {
        err(er, 80);
    }
});

const uncheck_icon_input_default_checkbox = action(() => {
    try {
        const icon_item = shared.find_from_name(inputs_data.obj.theme_metadata, 'icon');

        icon_item.default = false;

    } catch (er) {
        err(er, 81);
    }
});
//< select folder and fill inputs with theme data;
