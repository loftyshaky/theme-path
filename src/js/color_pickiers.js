import x from 'x';
import * as change_val from 'js/change_val';
import * as imgs from 'js/imgs';
import { inputs_data } from 'js/inputs_data';

import { action, configure } from "mobx";
import * as r from 'ramda';
const hexToHsl = require('hex-to-hsl');
const hexToRgb = require('hex-to-rgb');

configure({ enforceActions: 'observed' });

export const show_or_hide_color_pickier_when_clicking_on_color_input_vizualization = e => {
    const color_ok_btn_clicked = x.matches(e.target, '.color_ok_btn');

    if (!color_ok_btn_clicked) {
        const previously_opened_color_pickier = mut.current_color_pickier.el;

        //> try to hide color pickier when clicking outside of color pickier t
        if (previously_opened_color_pickier) { // if current color pickier's current state exsist
            const clicked_outside_of_color_pickier = !mut.current_color_pickier.el.contains(e.target);

            if (clicked_outside_of_color_pickier) {
                mut.current_color_pickier.el = null;

                show_or_hide_color_pickier(mut.current_color_pickier.family, mut.current_color_pickier.i, false);

                set_color_input_vizualization_color(mut.current_color_pickier.family, mut.current_color_pickier.i, mut.current_color_pickier.color);
            }
        }
        //< try to hide color pickier when clicking outside of color pickier t

        //> try to show color pickier when clicking on color_input_vizualization t
        const clicked_on_color_input_vizualization = x.matches(e.target, '.color_input_vizualization');

        if (clicked_on_color_input_vizualization) {
            const color_pickier = sb(e.target, '.color_pickier');
            const family = e.target.dataset.family;
            const i = e.target.dataset.i;
            const color_pickier_hidden = !inputs_data.obj[family][i].color_pickier_is_visible;
            const clicked_on_same_color_input_vizualization_second_time = previously_opened_color_pickier == color_pickier

            if (color_pickier_hidden && !clicked_on_same_color_input_vizualization_second_time) {
                const margin_bottom_of_body_plus_fieldset_border = parseInt(window.getComputedStyle(s('body')).marginBottom) + parseInt(window.getComputedStyle(s('fieldset')).borderWidth);
                mut.current_color_pickier.el = color_pickier;
                mut.current_color_pickier.family = family;
                mut.current_color_pickier.i = i;
                mut.current_color_pickier.color = inputs_data.obj[family][i].color || inputs_data.obj[family][i].val;

                show_or_hide_color_pickier(family, i, true);
                set_color_color_pickier_position(family, i, 'top');

                const color_pickier_is_fully_visible = color_pickier.getBoundingClientRect().bottom <= window.innerHeight - margin_bottom_of_body_plus_fieldset_border;

                if (!color_pickier_is_fully_visible) {
                    set_color_color_pickier_position(family, i, 'bottom');
                }
            }
        }
        //< try to show color pickier when clicking on color_input_vizualization t
    }
};

export const show_or_hide_color_pickier = action((family, i, bool) => {
    inputs_data.obj[family][i].color_pickier_is_visible = bool;
});

export const set_color_color_pickier_position = action((family, i, val) => {
    inputs_data.obj[family][i].color_pickiers_position = val;
});

export const set_color_input_vizualization_color = action((family, i, color) => {
    const color_final = color.hex || color;

    if (family == 'images' || inputs_data.obj[family][i].name == 'icon') {
        inputs_data.obj[family][i].color = color_final;

    } else {
        inputs_data.obj[family][i].val = color_final;
    }
});

//> accept color when clicking OK t
export const accept_color = (family, i) => {
    const hex = inputs_data.obj[family][i].color || inputs_data.obj[family][i].val;
    const name = inputs_data.obj[family][i].name;
    let color;

    if (family == 'images' || name == 'icon') {
        color = hex;

        imgs.create_solid_color_image(name, color);

        change_val.change_val(family, i, name, null);

    } else if (family == 'colors') {
        color = hexToRgb(hex);

        change_val.change_val(family, i, color, null);

    } else if (family == 'tints') {
        const hsl = hexToHsl(hex);
        const h = hsl[0] / 360;
        const sl = [hsl[1], hsl[2]];
        const sl_final = sl.map(item => item == 100 ? 1 : Number('0.' + item));
        color = r.prepend(h, sl_final);

        change_val.change_val(family, i, color, null);
    }

    show_or_hide_color_pickier(family, i, false);
    change_val.set_inputs_data_val(family, i, hex);

    mut.current_color_pickier.el = null;
};
//< accept color when clicking OK t

//> varibles t
const mut = {
    current_color_pickier: {
        el: null,
        family: '',
        i: '',
        color: ''
    }
};
//< varibles t