'use strict';

import * as shared from 'js/shared';
import { inputs_data } from "js/inputs_data";

import { action, configure } from "mobx";
import * as r from 'ramda';

configure({ enforceActions: 'observed' });

export const convert_theme_color_props_to_color = action((family, i, val) => {
    const val_is_arr = Array.isArray(val);

    if (family == 'images') {
        inputs_data.obj[family][i].color = shared.sta.yellow;

        if (val != '') {
            inputs_data.obj[family][i].default = false;
        }

    } else if (family == 'colors') {
        if (val_is_arr) {
            const rgb_val = val.length == 4 ? r.dropLast(1, val) : val;

            if (val != '') {
                inputs_data.obj[family][i].val = 'rgb(' + rgb_val.join() + ')';
                inputs_data.obj[family][i].default = false;

            } else {
                inputs_data.obj[family][i].val = shared.sta.yellow;
            }
        }

    } else if (family == 'tints') {
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
                    inputs_data.obj[family][i].val = shared.sta.black;
                    inputs_data.obj[family][i].default = false;
                    inputs_data.obj[family][i].disable = true;

                } else {
                    inputs_data.obj[family][i].val = 'hsl(' + hsla_arr.join() + ')';
                    inputs_data.obj[family][i].default = false;
                }

            } else {
                inputs_data.obj[family][i].val = shared.sta.yellow;
            }
        }
    }
});

export const convert_all = () => {
    convert_family('images');
    convert_family('colors');
    convert_family('tints');
};

const convert_family = (family) => {
    inputs_data.obj[family].forEach((item, i) => {
        convert_theme_color_props_to_color(family, i, item.val);
    });
};
