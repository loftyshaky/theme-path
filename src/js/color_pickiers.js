'use_strict';

import * as r from 'ramda';
import { action, configure } from 'mobx';
import tinycolor from 'tinycolor2';
import Store from 'electron-store';

import x from 'x';
import { inputs_data } from 'js/inputs_data';
import * as analytics from 'js/analytics';
import * as change_val from 'js/change_val';
import * as imgs from 'js/imgs';
import * as picked_colors from 'js/picked_colors';
import * as history from 'js/history';
import * as options from 'js/options';
import * as conds from 'js/conds';

configure({ enforceActions: 'observed' });
const store = new Store();

export const show_or_hide_color_pickier_when_clicking_on_color_input_vizualization = e => {
    try {
        const color_ok_btn_clicked = x.matches(e.target, '.color_ok_btn');

        if (!color_ok_btn_clicked) {
            const previously_opened_color_pickier = mut.current_color_pickier.el;
            const ordinary_color_input_inner = x.closest(e.target, '.ordinary_color_input_inner');

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
                const color_pickier = sb(ordinary_color_input_inner, '.pcr-app');
                const { family, name } = e.target.dataset;
                const color_pickier_hidden = !inputs_data.obj[family][name].color_pickier_is_visible;
                const clicked_on_same_color_input_vizualization_second_time = previously_opened_color_pickier === color_pickier;

                if (color_pickier_hidden && !clicked_on_same_color_input_vizualization_second_time) {
                    const body_margin_bottom = parseInt(window.getComputedStyle(s('body')).marginBottom);
                    const fieldset_border_width = parseInt(window.getComputedStyle(s('fieldset')).borderWidth);
                    const margin_bottom_of_body_plus_fieldset_border_width = body_margin_bottom + fieldset_border_width;
                    mut.current_color_pickier.el = ordinary_color_input_inner;
                    mut.current_color_pickier.family = family;
                    mut.current_color_pickier.name = name;
                    mut.current_color_pickier.color = inputs_data.obj[family][name].color || inputs_data.obj[family][name].val;
                    mut.previous_pickied_color = mut.current_color_pickier.color;

                    set_color_color_pickier_position(color_pickier, 'bottom', family, name);
                    change_color_pickier_display_status(family, name, true);

                    const color_pickier_is_fully_visible = color_pickier.getBoundingClientRect().bottom <= window.innerHeight - margin_bottom_of_body_plus_fieldset_border_width;

                    if (!color_pickier_is_fully_visible) {
                        set_color_color_pickier_position(color_pickier, 'top', family, name);
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

const change_color_pickier_display_status = action((family, name, bool) => {
    try {
        inputs_data.obj[family][name].color_pickier_is_visible = bool;

        if (!bool) {
            inputs_data.obj[family][name].changed_color_once_after_focus = false;
        }

    } catch (er) {
        err(er, 32);
    }
});

const set_color_color_pickier_position = action((color_pickier, position, family, name) => {
    try {
        x.remove_cls(color_pickier, 'color_pickier_tall_offset_top');
        x.remove_cls(color_pickier, 'color_pickier_ordinary_offset_top');
        x.remove_cls(color_pickier, 'color_pickier_tall_offset_bottom');
        x.remove_cls(color_pickier, 'color_pickier_ordinary_offset_bottom');

        x.add_cls(color_pickier, `color_pickier_${family === 'images' || name === 'icon' ? 'tall' : 'ordinary'}_offset_${position}`);

    } catch (er) {
        err(er, 33);
    }
});

export const set_color_input_vizualization_color = action((family, name, color) => {
    try {
        const rgba_string = typeof color === 'string' ? color : stringify_unpacked_rgba(color);

        inputs_data.obj[family][name].color = rgba_string;

    } catch (er) {
        err(er, 34);
    }
});

//> accept color when clicking OK t
export const accept_color = (family, name) => {
    try {
        const was_default = inputs_data.obj[family][name].default;
        const was_disabled = Boolean(inputs_data.obj[family][name].disabled);
        const app_theme = store.get('theme');
        const from_rgba_string = mut.previous_pickied_color === options.ob.theme_vals[app_theme].color_input_default || mut.previous_pickied_color === options.ob.theme_vals[app_theme].color_input_disabled ? null : mut.previous_pickied_color;
        const to_rgba_string = stringify_unpacked_rgba(mut.current_pickied_color);
        let from_manifest_val;
        let to_manifest_val;

        if (family === 'images' || name === 'icon') {
            const hex = tinycolor(to_rgba_string).toHex();
            let history_obj;

            if (conds.imgs(family, name)) {
                history_obj = history.record_change(() => history.generate_img_history_obj(family, name, was_default, mut.current_pickied_color, false));
            }

            imgs.create_solid_color_image(family, name, hex, mut.current_pickied_color.a, history_obj);

            change_val.change_val(family, name, name, null, true, true);

            picked_colors.record_picked_color(family, name);

        } else if (family === 'colors') {
            if (from_rgba_string) {
                from_manifest_val = convert_rgba_string_into_rgb_arr(from_rgba_string);
            }

            if (to_rgba_string) {
                to_manifest_val = convert_rgba_string_into_rgb_arr(to_rgba_string);
            }

            change_val.change_val(family, name, to_manifest_val, null, true, true);

        } else if (family === 'tints') {
            if (from_rgba_string) {
                from_manifest_val = convert_rgba_strings_to_tint_val(from_rgba_string);
            }

            if (to_rgba_string) {
                to_manifest_val = convert_rgba_strings_to_tint_val(to_rgba_string);
            }

            change_val.change_val(family, name, to_manifest_val, null, true, true);
        }

        change_color_pickier_display_status(family, name, false);

        if (family !== 'images') {
            change_val.set_inputs_data_val(family, name, to_rgba_string);
        }

        mut.current_color_pickier.el = null;

        if (conds.colors(family)) {
            history.record_change(() => history.generate_color_history_obj(family, name, was_default, was_disabled, from_rgba_string, from_manifest_val, to_rgba_string, mut.current_pickied_color, to_manifest_val, false));
        }

        if (family === 'colors') {
            picked_colors.record_picked_color(family, name);
        }

        analytics.send_event('color_pickiers', `accepted_color-${family}-${name}`);

    } catch (er) {
        err(er, 35);
    }
};
//< accept color when clicking OK t

const cancel_color_picking = () => {
    try {
        const any_color_pickier_is_opened = mut.current_color_pickier.el;

        if (any_color_pickier_is_opened) {
            mut.current_color_pickier.el = null;
            const { family, name, color } = mut.current_color_pickier;

            change_color_pickier_display_status(family, name, false);
            set_color_input_vizualization_color(family, name, color);

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

        if (enter_pressed && any_color_pickier_is_opened) {
            mut.accepted_by_enter_key = true;

            document.activeElement.blur(); // prevent color_input_vizualization focus

            accept_color(family, name);
        }

    } catch (er) {
        err(er, 182);
    }
};

export const focus_input_and_select_all_text_in_it = color_pickier_w => {
    try {
        const color_val_input = sb(color_pickier_w, '.pcr-result');

        focus_input_and_select_all_text_in_it_inner(color_val_input);

    } catch (er) {
        err(er, 183);
    }
};

const focus_input_and_select_all_text_in_it_inner = async input => {
    try {
        if (input) {
            await x.delay(50);

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

export const unpack_rgba = pickr_color_obj => {
    try {
        const rgba = tinycolor.fromRatio({ h: pickr_color_obj.h, s: pickr_color_obj.s, v: pickr_color_obj.v, a: pickr_color_obj.a });

        mut.current_pickied_color.r = rgba._r; // eslint-disable-line no-underscore-dangle
        mut.current_pickied_color.g = rgba._g; // eslint-disable-line no-underscore-dangle
        mut.current_pickied_color.b = rgba._b; // eslint-disable-line no-underscore-dangle
        mut.current_pickied_color.a = rgba._a; // eslint-disable-line no-underscore-dangle

    } catch (er) {
        err(er, 245);
    }

    return undefined;
};

export const stringify_unpacked_rgba = rgba_obj => {
    try {
        return `rgba(${rgba_obj.r},${rgba_obj.g},${rgba_obj.b},${rgba_obj.a})`;

    } catch (er) {
        err(er, 246);
    }

    return undefined;
};

export const convert_rgba_string_into_rgb_arr = rgba_string => {
    try {
        const rgba_string_splitted = rgba_string.split(',');

        const rgba_arr = rgba_string_splitted.map(item => Math.round(+item.replace(/rgba\(/, '').replace(/\)/, '')));

        rgba_arr.pop();

        return rgba_arr;

    } catch (er) {
        err(er, 247);
    }

    return undefined;
};

export const convert_rgba_arr_into_string = rgba_arr => {
    try {
        const rgba_arr_final = rgba_arr;
        const no_alpha = rgba_arr_final.length === 3;

        if (no_alpha) {
            rgba_arr_final.push(1);
        }

        return `rgba(${rgba_arr_final.join(',')})`;

    } catch (er) {
        err(er, 248);
    }

    return undefined;
};

export const convert_rgba_arr_into_obj = rgba_arr => {
    try {
        return {
            r: rgba_arr[0],
            g: rgba_arr[1],
            b: rgba_arr[2],
            a: 1,
        };

    } catch (er) {
        err(er, 289);
    }

    return undefined;
};


export const convert_rgba_obj_into_string = rgba_obj => {
    try {
        return `rgba(${rgba_obj.r},${rgba_obj.g},${rgba_obj.b},${rgba_obj.a})`;

    } catch (er) {
        err(er, 295);
    }

    return undefined;
};

export const convert_rgba_strings_to_tint_val = rgba_string => {
    try {
        const hsl = r.values(tinycolor(rgba_string).toHsl());
        hsl.pop();
        hsl[0] /= 360;

        return hsl;

    } catch (er) {
        err(er, 275);
    }

    return undefined;
};


export const convert_hsl_arr_to_hsl_string = hsl_arr => {
    try {
        return tinycolor.fromRatio({ h: hsl_arr[0], s: hsl_arr[1], l: hsl_arr[2] }).toRgbString();

    } catch (er) {
        err(er, 276);
    }

    return undefined;
};

export const con = {
    no_alpha: ['theme_frame', 'theme_frame_inactive', 'theme_frame_incognito', 'theme_frame_incognito_inactive'],
};

export const mut = {
    current_pickied_color: {},
    previous_pickied_color: {},
    current_color_pickier: {
        el: null,
        family: '',
        name: '',
        color: '',
    },
    accepted_by_enter_key: false,
};
