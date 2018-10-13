'use strict';

import { inputs_data } from "js/inputs_data";

import { action, configure } from "mobx";
import * as r from 'ramda';

configure({ enforceActions: 'observed' });

export const convert_theme_color_props_to_color = action((family, i, val) => {
    const yellow = '#fbff75';

    if (family == 'images') {
        inputs_data.obj[family][i].color_input_vizualization = yellow;

        if (val != '') {
            inputs_data.obj[family][i].default = false;
        }

    } else if (family == 'colors') {
        const rgb_val = val.length == 4 ? r.dropLast(1, val) : val;
        
        if (val != '') {
            inputs_data.obj[family][i].val = 'rgb(' + rgb_val.join() + ')';
            inputs_data.obj[family][i].default = false;
        } else {
            inputs_data.obj[family][i].val = yellow;
        }

    } else if (family == 'tints') {
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
                inputs_data.obj[family][i].val = '#212121';
                inputs_data.obj[family][i].default = false;

            } else {
                inputs_data.obj[family][i].val = 'hsl(' + hsla_arr.join() + ')';
                inputs_data.obj[family][i].default = false;
                inputs_data.obj[family][i].disable = false;
            }

        } else {
            inputs_data.obj[family][i].val = yellow;
            inputs_data.obj[family][i].disable = false;
        }
    }
});