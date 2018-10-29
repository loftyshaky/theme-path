'use strict';

import { inputs_data } from 'js/inputs_data';
import * as change_val from 'js/change_val';
import * as settings from 'js/settings';

import * as r from 'ramda';
import Store from 'electron-store';

const store = new Store();

//--

export const convert_theme_color_props_to_color = (family, i, val) => {
    const color_input_default = settings.ob.theme_vals[store.get('theme')].color_input_default;
    const val_is_arr = Array.isArray(val);

    if (family == 'images') {
        change_val.set_inputs_data_color(family, i, color_input_default);

        if (val != '') {
            change_val.set_default_bool(family, i, false);
        }

    } else if (family == 'colors') {
        change_val.set_inputs_data_val(family, i, color_input_default);

        if (val_is_arr) {
            const rgb_val = val.length == 4 ? r.dropLast(1, val) : val;

            if (val != '') {
                change_val.set_inputs_data_val(family, i, 'rgb(' + rgb_val.join() + ')');
                change_val.set_default_bool(family, i, false);
            }
        }

    } else if (family == 'tints') {
        change_val.set_inputs_data_val(family, i, color_input_default);

        if (val_is_arr) {
            if (val != '') {
                const hsla_arr = val.map((number, i) => {
                    if (i == 0) {
                        if (number < 0 || number > 1) {
                            return '-1';

                        } else {
                            return 360 * number + '';
                        }

                    } else {
                        if (number < 0 || number > 1) {
                            return '-1%';

                        } else {
                            return number * 100 + '%';
                        }
                    }
                });
                const every_number_in_hsla_arr_is_minus_1 = hsla_arr.every(number => number.indexOf('-1') > -1);

                if (every_number_in_hsla_arr_is_minus_1) {
                    change_val.set_inputs_data_val(family, i, settings.ob.theme_vals[store.get('theme')].color_input_disabled);
                    change_val.set_default_bool(family, i, false);
                    change_val.set_disable_bool(family, i, true);

                } else {
                    change_val.set_inputs_data_val(family, i, 'hsl(' + hsla_arr.join() + ')');
                    change_val.set_default_bool(family, i, false);
                }
            }
        }

    } else if (family == 'theme_metadata') {
        if (inputs_data.obj[family][i].type == 'img_selector') {
            change_val.set_inputs_data_color(family, i, color_input_default);
        }
    }
};

export const convert_all = () => {
    convert_family('images');
    convert_family('colors');
    convert_family('tints');
    convert_family('theme_metadata');
};

const convert_family = (family) => {
    inputs_data.obj[family].forEach((item, i) => {
        convert_theme_color_props_to_color(family, i, item.val);
    });
};
