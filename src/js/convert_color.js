'use strict';

import * as shared from 'js/shared';
import * as settings from 'js/settings';
import { inputs_data } from "js/inputs_data";

import { action, configure } from "mobx";
import * as r from 'ramda';
const Store = require('electron-store');

const store = new Store();

configure({ enforceActions: 'observed' });

export const convert_theme_color_props_to_color = action((family, i, val) => {
    const color_input_default = settings.ob.theme_vals[store.get('theme')].color_input_default;
    const val_is_arr = Array.isArray(val);

    if (family == 'images') {
        inputs_data.obj[family][i].color = color_input_default;

        if (val != '') {
            inputs_data.obj[family][i].default = false;
        }

    } else if (family == 'colors') {
        inputs_data.obj[family][i].val = color_input_default;

        if (val_is_arr) {
            const rgb_val = val.length == 4 ? r.dropLast(1, val) : val;

            if (val != '') {
                inputs_data.obj[family][i].val = 'rgb(' + rgb_val.join() + ')';
                inputs_data.obj[family][i].default = false;
            }
        }

    } else if (family == 'tints') {
        inputs_data.obj[family][i].val = color_input_default;

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
                    inputs_data.obj[family][i].val = settings.ob.theme_vals[store.get('theme')].color_input_disabled;
                    inputs_data.obj[family][i].default = false;
                    inputs_data.obj[family][i].disable = true;

                } else {
                    inputs_data.obj[family][i].val = 'hsl(' + hsla_arr.join() + ')';
                    inputs_data.obj[family][i].default = false;
                }
            }
        }
    } else if (family == 'theme_metadata') {
        if (inputs_data.obj[family][i].type == 'img_selector') {
            inputs_data.obj[family][i].color = color_input_default;
        }
    }
});

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
