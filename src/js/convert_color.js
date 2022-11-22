import * as r from 'ramda';
import Store from 'electron-store';

import { inputs_data } from 'js/inputs_data';
import * as manifest from 'js/manifest';
import * as change_val from 'js/change_val';
import * as color_pickiers from 'js/color_pickiers';
import * as options from 'js/options';
import * as folders from 'js/work_folder/folders';
import * as picked_colors from 'js/picked_colors';
import * as conds from 'js/conds';

const store = new Store();

const mut = {
    picked_colors_obj: null,
};

const convert_theme_color_props_to_color = (item) => {
    try {
        const { color_input_default } = options.ob.theme_vals[store.get('theme')];
        const val_is_arr = Array.isArray(item.val);
        const { family, name, val } = item;

        const val_is_default =
            !manifest.mut.manifest ||
            !manifest.mut.manifest.theme ||
            !manifest.mut.manifest.theme[family] ||
            !manifest.mut.manifest.theme[family][name];

        if (family === 'images') {
            const no_picked_color_for_this_element =
                !mut.picked_colors_obj ||
                !mut.picked_colors_obj[family] ||
                !mut.picked_colors_obj[family][name];

            if (no_picked_color_for_this_element) {
                change_val.set_inputs_data_color(family, name, color_input_default);
            }

            if (!val_is_default) {
                change_val.set_default_bool(family, name, false);
            }
        } else if (family === 'colors') {
            if (val_is_default) {
                change_val.set_inputs_data_val(family, name, color_input_default);
                change_val.set_inputs_data_color(family, name, color_input_default);
            }

            if (val_is_arr) {
                if (!val_is_default) {
                    change_val.set_inputs_data_val(
                        family,
                        name,
                        color_pickiers.convert_rgba_arr_into_string(val),
                    );
                    change_val.set_default_bool(family, name, false);
                }
            }
        } else if (family === 'tints') {
            if (val_is_arr) {
                if (!val_is_default) {
                    const hsl_arr = r.values(val);
                    const every_number_in_hsla_arr_is_minus_1 = hsl_arr.every(
                        (number) => number.toString().indexOf('-1') > -1,
                    );

                    const set_disabled_and_default_checkbox_vals = () => {
                        try {
                            if (every_number_in_hsla_arr_is_minus_1) {
                                change_val.set_default_bool(family, name, false);
                                change_val.set_disabled_bool(family, name, true);
                            } else {
                                change_val.set_default_bool(family, name, false);
                            }
                        } catch (er) {
                            err(er, 337);
                        }
                    };

                    set_disabled_and_default_checkbox_vals();
                }
            }
        } else if (family === 'theme_metadata') {
            if (item.type === 'img_selector' && val_is_default) {
                change_val.set_inputs_data_color(family, name, color_input_default);
            }
        } else if (name === 'clear_new_tab_video') {
            const clear_new_tab_video_exist =
                folders.find_file_name_by_element_name('clear_new_tab_video');

            if (clear_new_tab_video_exist) {
                change_val.set_default_bool(family, name, false);
            }
        } else if (conds.textareas_with_default_checkbox(family, name)) {
            change_val.set_default_bool(family, name, inputs_data.obj[family][name].val === '');
        }
    } catch (er) {
        err(er, 36);
    }
};

const convert_family = (family) => {
    try {
        Object.values(inputs_data.obj[family]).forEach((item) => {
            convert_theme_color_props_to_color(item);
        });
    } catch (er) {
        err(er, 37);
    }
};

export const convert_all = () => {
    mut.picked_colors_obj = picked_colors.get_picked_colors_obj();

    convert_family('images');
    convert_family('colors');
    convert_family('tints');
    convert_family('theme_metadata');
    convert_family('clear_new_tab');
};
