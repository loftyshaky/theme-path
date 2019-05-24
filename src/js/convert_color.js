import * as r from 'ramda';
import Store from 'electron-store';
import colorConvert from 'color-convert';

import { inputs_data } from 'js/inputs_data';
import * as change_val from 'js/change_val';
import * as options from 'js/options';
import * as folders from 'js/work_folder/folders';

const store = new Store();

const convert_theme_color_props_to_color = item => {
    try {
        const { color_input_default } = options.ob.theme_vals[store.get('theme')];
        const val_is_arr = Array.isArray(item.val);
        const color_is_not_set_in_picked_colors_json = item.color === options.ob.theme_vals.dark.color_input_default || item.color === options.ob.theme_vals.light.color_input_default;
        const { family, name, val } = item;

        if (family === 'images') {
            if (color_is_not_set_in_picked_colors_json) {
                change_val.set_inputs_data_color(family, name, color_input_default);
            }

            if (val !== '') {
                change_val.set_default_bool(family, name, false);
            }

        } else if (family === 'colors') {
            change_val.set_inputs_data_val(family, name, color_input_default);

            if (val_is_arr) {
                const rgb_val = val.length === 4 ? r.dropLast(1, val) : val;
                if (val !== '') {
                    change_val.set_inputs_data_val(family, name, `#${colorConvert.rgb.hex(rgb_val)}`);
                    change_val.set_default_bool(family, name, false);
                }
            }

        } else if (family === 'tints') {
            change_val.set_inputs_data_val(family, name, color_input_default);

            if (val_is_arr) {
                if (val !== '') {
                    const hsl_arr = val.map((number, number_i) => {
                        if (number_i === 0) {
                            if (number < 0 || number > 1) {
                                return '-1';

                            }

                            return `${360 * number}`;
                        }

                        if (number < 0 || number > 1) {
                            return '-1';
                        }

                        return `${number * 100}`;
                    });

                    const every_number_in_hsla_arr_is_minus_1 = hsl_arr.every(number => number.indexOf('-1') > -1);

                    if (every_number_in_hsla_arr_is_minus_1) {
                        change_val.set_inputs_data_val(family, name, options.ob.theme_vals[store.get('theme')].color_input_disabled);
                        change_val.set_default_bool(family, name, false);
                        change_val.set_disabled_bool(family, name, true);

                    } else {
                        change_val.set_inputs_data_val(family, name, `#${colorConvert.hsl.hex(hsl_arr)}`);
                        change_val.set_default_bool(family, name, false);
                    }
                }
            }

        } else if (family === 'theme_metadata') {
            if (item.type === 'img_selector' && color_is_not_set_in_picked_colors_json) {
                change_val.set_inputs_data_color(family, name, color_input_default);
            }

        } else if (name === 'clear_new_tab_video') {
            const clear_new_tab_video_exist = folders.find_file_with_exist('clear_new_tab_video');

            if (clear_new_tab_video_exist) {
                change_val.set_default_bool(family, name, false);
            }
        }

    } catch (er) {
        err(er, 36);
    }
};

export const convert_all = () => {
    convert_family('images');
    convert_family('colors');
    convert_family('tints');
    convert_family('theme_metadata');
    convert_family('clear_new_tab');
};

const convert_family = family => {
    try {
        Object.values(inputs_data.obj[family]).forEach(item => {
            convert_theme_color_props_to_color(item);
        });

    } catch (er) {
        err(er, 37);
    }
};
