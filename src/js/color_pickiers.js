'use_strict';

import { action, configure } from 'mobx';
import * as r from 'ramda';
import colorConvert from 'color-convert';

import x from 'x';
import { inputs_data } from 'js/inputs_data';
import * as analytics from 'js/analytics';
import * as change_val from 'js/change_val';
import * as imgs from 'js/imgs';
import * as picked_colors from 'js/picked_colors';
import * as history from 'js/history';

configure({ enforceActions: 'observed' });

export const show_or_hide_color_pickier_when_clicking_on_color_input_vizualization = e => {
    try {
        const color_ok_btn_clicked = x.matches(e.target, '.color_ok_btn');

        if (!color_ok_btn_clicked) {
            const previously_opened_color_pickier = mut.current_color_pickier.el;

            //> try to hide color pickier when clicking outside of color pickier t
            if (previously_opened_color_pickier) { // if current color pickier's current state exsist
                const clicked_outside_of_color_pickier = !mut.current_color_pickier.el.contains(e.target);

                if (clicked_outside_of_color_pickier) {
                    cancel_color_picking();
                }
            }
            //< try to hide color pickier when clicking outside of color pickier t

            //> try to show color pickier when clicking on color_input_vizualization t
            const clicked_on_color_input_vizualization = x.matches(e.target, '.color_input_vizualization');

            if (clicked_on_color_input_vizualization) {
                const color_pickier = sb(e.target, '.color_pickier');
                const { family, name } = e.target.dataset;
                const color_pickier_hidden = !inputs_data.obj[family][name].color_pickier_is_visible;
                const clicked_on_same_color_input_vizualization_second_time = previously_opened_color_pickier === color_pickier;

                if (color_pickier_hidden && !clicked_on_same_color_input_vizualization_second_time) {
                    const body_margin_bottom = parseInt(window.getComputedStyle(s('body')).marginBottom);
                    const fieldset_border_width = parseInt(window.getComputedStyle(s('fieldset')).borderWidth);
                    const margin_bottom_of_body_plus_fieldset_border_width = body_margin_bottom + fieldset_border_width;
                    mut.current_color_pickier.el = color_pickier;
                    mut.current_color_pickier.family = family;
                    mut.current_color_pickier.name = name;
                    mut.current_color_pickier.color = inputs_data.obj[family][name].color || inputs_data.obj[family][name].val;
                    mut.current_pickied_color.hex = mut.current_color_pickier.color;
                    mut.previous_pickied_color = mut.current_pickied_color;

                    show_or_hide_color_pickier(family, name, true);
                    set_color_color_pickier_position(family, name, 'top');

                    const color_pickier_is_fully_visible = color_pickier.getBoundingClientRect().bottom <= window.innerHeight - margin_bottom_of_body_plus_fieldset_border_width;

                    if (!color_pickier_is_fully_visible) {
                        set_color_color_pickier_position(family, name, 'bottom');
                    }

                    analytics.send_event('color_pickiers', `showed-${family}-${name}`);
                }
            }
            //< try to show color pickier when clicking on color_input_vizualization t
        }

    } catch (er) {
        err(er, 31);
    }
};

export const show_or_hide_color_pickier = action((family, name, bool) => {
    try {
        mut.current_pickied_color.rgb.a = 1;
        inputs_data.obj[family][name].color_pickier_is_visible = bool;

        if (!bool) {
            inputs_data.obj[family][name].changed_color_once_after_focus = false;
        }

    } catch (er) {
        err(er, 32);
    }
});

export const set_color_color_pickier_position = action((family, name, val) => {
    try {
        inputs_data.obj[family][name].color_pickiers_position = val;

    } catch (er) {
        err(er, 33);
    }
});

export const set_color_input_vizualization_color = action((family, name, color, loading_old_colors_from_picked_colors_json) => {
    try {
        if (family === 'images' || name === 'icon') {
            const color_final = color.rgb || loading_old_colors_from_picked_colors_json ? `rgba(${r.values(color.rgb || color).join(',')})` : color;

            inputs_data.obj[family][name].color = color_final;

        } else {
            inputs_data.obj[family][name].val = color.hex || color;
        }

    } catch (er) {
        err(er, 34);
    }
});

//> accept color when clicking OK t
export const accept_color = (family, name) => {
    try {
        const was_default = inputs_data.obj[family][name].default;
        const was_disabled = Boolean(inputs_data.obj[family][name].disabled);
        const { hex } = mut.current_pickied_color;
        const { hex: previous_hex } = mut.previous_pickied_color;
        let color;
        let previous_manifest_val;

        if (family === 'images' || name === 'icon') {
            if (history.imgs_cond(family, name)) {
                history.record_change(() => history.generate_img_history_obj(family, name, was_default, mut.current_pickied_color.rgb, false));
            }

            imgs.create_solid_color_image(family, name, hex, mut.current_pickied_color.rgb.a);

            change_val.change_val(family, name, name, null, true);

            picked_colors.record_picked_color(family, name);

        } else if (family === 'colors') {
            color = colorConvert.hex.rgb(hex);
            previous_manifest_val = colorConvert.hex.rgb(previous_hex);
            change_val.change_val(family, name, color, null, true);

        } else if (family === 'tints') {
            color = convert_hex_to_tints_val(hex);
            previous_manifest_val = convert_hex_to_tints_val(previous_hex);

            change_val.change_val(family, name, color, null, true);
        }

        show_or_hide_color_pickier(family, name, false);

        if (family !== 'images') {
            change_val.set_inputs_data_val(family, name, hex);
        }

        mut.current_color_pickier.el = null;

        if (history.colors_cond(family)) {
            history.record_change(() => history.generate_color_history_obj(family, name, was_default, was_disabled, previous_hex, previous_manifest_val, hex, false, false));
        }

        analytics.send_event('color_pickiers', `accepted_color-${family}-${name}`);

    } catch (er) {
        err(er, 35);
    }
};

export const convert_hex_to_tints_val = hex => {
    const hsl = colorConvert.hex.hsl(hex);
    const h = hsl[0] / 360;
    const sl = [hsl[1], hsl[2]];
    const sl_final = sl.map(item => (item === 100 ? 1 : Number(`0.${item}`)));
    const color = r.prepend(h, sl_final);

    return color;
};
//< accept color when clicking OK t

const cancel_color_picking = () => {
    try {
        const any_color_pickier_is_opened = mut.current_color_pickier.el;

        if (any_color_pickier_is_opened) {
            mut.current_color_pickier.el = null;
            const { family, name } = mut.current_color_pickier;

            show_or_hide_color_pickier(family, name, false);

            set_color_input_vizualization_color(family, name, mut.current_color_pickier.color, false);

            analytics.send_event('color_pickiers', `canceled-${family}-${name}`);
        }

    } catch (er) {
        err(er, 181);
    }
};

export const close_or_open_color_pickier_by_keyboard = e => {
    try {
        const { family, name } = mut.current_color_pickier;
        const any_color_pickier_is_opened = mut.current_color_pickier.el;
        const enter_pressed = e.keyCode === 13;
        const esc_pressed = e.keyCode === 27;

        if (enter_pressed && any_color_pickier_is_opened) {
            document.activeElement.blur(); // prevent color_input_vizualization focus
        }

        if (enter_pressed) {
            if (any_color_pickier_is_opened) {
                accept_color(family, name);
            }

        } else if (esc_pressed) {
            cancel_color_picking();
        }

    } catch (er) {
        err(er, 182);
    }
};

export const focus_input_and_select_all_text_in_it = e => {
    try {
        const color_val_inputs = sab(e.target, 'input');
        const number_of_color_val_inputs = color_val_inputs.length;
        const color_pickier_is_in_hex_mode = number_of_color_val_inputs === 1;
        const color_pickier_is_in_rgb_or_hsl_mode = number_of_color_val_inputs === 4 && !color_val_inputs[number_of_color_val_inputs - 1].offsetParent;

        if (color_pickier_is_in_hex_mode || color_pickier_is_in_rgb_or_hsl_mode) {
            focus_input_and_select_all_text_in_it_inner(color_val_inputs[0]);

        } else { // color pickier is in rgba or hsla mode
            focus_input_and_select_all_text_in_it_inner(color_val_inputs[number_of_color_val_inputs - 1]);
        }

    } catch (er) {
        err(er, 183);
    }
};

const focus_input_and_select_all_text_in_it_inner = input => {
    try {
        if (input) {
            input.focus();
            input.setSelectionRange(0, input.value.length);
        }

    } catch (er) {
        err(er, 184);
    }
};

export const defocus_color_field = () => {
    try {
        document.activeElement.blur();

    } catch (er) {
        err(er, 185);
    }
};

export const con = {
    no_alpha: ['theme_frame', 'theme_frame_inactive', 'theme_frame_incognito', 'theme_frame_incognito_inactive'],
};

export const mut = {
    current_pickied_color: {
        rgb: {
            a: 1, // alpha
        },
    },
    previous_pickied_color: null,
    current_color_pickier: {
        el: null,
        family: '',
        name: '',
        color: '',
    },
};
