import { basename } from 'path';

// eslint-disable-next-line import/no-extraneous-dependencies
import { clipboard } from 'electron';
import * as r from 'ramda';
import { action } from 'mobx';
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
import * as json_file from 'js/json_file';
import * as conds from 'js/conds';

const store = new Store();

export const con = {
    no_alpha: [
        'theme_frame',
        'theme_frame_inactive',
        'theme_frame_incognito',
        'theme_frame_incognito_inactive',
    ],
};

export const mut = {
    current_pickied_color: [],
    previous_pickied_color: [],
    current_color_pickier: {
        el: null,
        family: '',
        name: '',
        color: '',
    },
    accepted_by_enter_key: false,
    current_pcr_app: null,
    current_color_representation: 'HEXA',
};

export const convert_pickr_rgba_obj_into_arr = (pickr_color_obj) => {
    try {
        const rgba_obj = tinycolor(pickr_color_obj.toHSVA().toString());

        // eslint-disable-next-line no-underscore-dangle
        mut.current_pickied_color = [rgba_obj._r, rgba_obj._g, rgba_obj._b, rgba_obj._a];
    } catch (er) {
        err(er, 245);
    }

    return undefined;
};

export const convert_rgba_arr_into_rounded_arr = (rgba_arr) => {
    try {
        const rounded_rgba_arr = rgba_arr.map((item) => Math.round(+item));

        rounded_rgba_arr.pop();

        return rounded_rgba_arr;
    } catch (er) {
        err(er, 247);
    }

    return undefined;
};

export const convert_rgba_string_into_rounded_arr = (rgba_string) => {
    try {
        const rgba_string_splitted = rgba_string.split(',');

        const rounded_rgba_arr = rgba_string_splitted.map((item) =>
            Math.round(+item.replace(/rgba\(/, '').replace(/\)/, '')),
        );

        rounded_rgba_arr.pop();

        return rounded_rgba_arr;
    } catch (er) {
        err(er, 295);
    }

    return undefined;
};

export const convert_rgba_arr_into_string = (rgba_arr) => {
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

export const convert_rgba_string_to_hsl_arr = (rgba_string) => {
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

export const convert_hsl_arr_to_rgba_string = (hsl_arr) => {
    try {
        const rgba_obj = tinycolor.fromRatio({
            h: hsl_arr[0],
            s: hsl_arr[1],
            l: hsl_arr[2],
        });

        // eslint-disable-next-line no-underscore-dangle
        return `rgba(${rgba_obj._r},${rgba_obj._g},${rgba_obj._b},${rgba_obj._a})`;
    } catch (er) {
        err(er, 276);
    }

    return undefined;
};

export const set_color_input_vizualization_color = action((family, name, color) => {
    try {
        const rgba_string = typeof color === 'string' ? color : convert_rgba_arr_into_string(color);

        inputs_data.obj[family][name].color = rgba_string;
    } catch (er) {
        err(er, 34);
    }
});

export const set_color_pickier_to_right_if_neeeded = (color_pickier_w) => {
    try {
        const pcr_app = sb(color_pickier_w, '.pcr-app');
        const fieldset_scroll_content = x.closest(color_pickier_w, '.fieldset_content');
        const padding = 12;

        if (
            Math.round(pcr_app.getBoundingClientRect().right) + padding >
            Math.round(fieldset_scroll_content.getBoundingClientRect().right)
        ) {
            x.add_cls(color_pickier_w, 'stick_right');
            x.add_cls(pcr_app, 'color_pickier_right');
        }
    } catch (er) {
        err(er, 319);
    }
};

export const remove_color_picker_input_selection_inner = () => {
    try {
        window.getSelection().removeAllRanges();

        mut.current_pcr_app.removeEventListener(
            'transitionend',
            remove_color_picker_input_selection_inner,
        );
    } catch (er) {
        err(er, 321);
    }
};

export const remove_color_picker_input_selection = (color_pickier_w) => {
    try {
        mut.current_pcr_app = sb(color_pickier_w, '.pcr-app');

        if (!store.get('highlight_color_picker_val_when_opening_color_picker')) {
            mut.current_pcr_app.addEventListener(
                'transitionend',
                remove_color_picker_input_selection_inner,
            );
        }
    } catch (er) {
        err(er, 320);
    }
};

export const copy_color_picker_input_val = (
    that,
    color_pickier_w,
    click_el_selector,
    family,
    name,
) => {
    try {
        x.bind(sb(color_pickier_w, click_el_selector), 'auxclick', (e) => {
            if (e.button === 1) {
                that.pickr.setColorRepresentation(mut.current_color_representation);

                const input = sb(color_pickier_w, '.pcr-result');

                input.blur();

                clipboard.writeText(input.value);

                set_color_input_vizualization_color(family, name, mut.previous_pickied_color);

                that.pickr.hide();
            }
        });

        x.bind(sb(color_pickier_w, click_el_selector), 'click', () => {
            // eslint-disable-next-line no-underscore-dangle
            mut.current_color_representation = that.pickr._representation;
        });
    } catch (er) {
        err(er, 322);
    }
};

export const paste_color_val_from_clipboard = (that, color_pickier_w, family, name) => {
    try {
        x.bind(sb(color_pickier_w, '.pcr-result'), 'auxclick', (e) => {
            if (e.button === 1) {
                const rgba_obj = tinycolor(clipboard.readText());
                // eslint-disable-next-line no-underscore-dangle
                rgba_obj._a =
                    // eslint-disable-next-line no-underscore-dangle
                    family === 'images' && con.no_alpha.indexOf(name) === -1 ? rgba_obj._a : 1;
                // eslint-disable-next-line no-underscore-dangle
                mut.current_pickied_color = [rgba_obj._r, rgba_obj._g, rgba_obj._b, rgba_obj._a];

                set_color_input_vizualization_color(family, name, rgba_obj.toRgbString());

                that.pickr.applyColor();
            }
        });
    } catch (er) {
        err(er, 323);
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

        x.add_cls(
            color_pickier,
            `color_pickier_${
                family === 'images' || name === 'icon' ? 'tall' : 'ordinary'
            }_offset_${position}`,
        );
    } catch (er) {
        err(er, 33);
    }
});

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

export const show_or_hide_color_pickier_when_clicking_on_color_input_vizualization = (e) => {
    try {
        const color_ok_btn_clicked = x.matches(e.target, '.color_ok_btn');

        if (!color_ok_btn_clicked) {
            const previously_opened_color_pickier = mut.current_color_pickier.el;
            const ordinary_color_input_inner = x.closest(e.target, '.ordinary_color_input_inner');

            const try_to_show_color_pickier_when_clicking_on_color_input_vizualization = () => {
                try {
                    const clicked_on_color_input_vizualization = x.matches(
                        e.target,
                        '.color_input_vizualization',
                    );

                    if (clicked_on_color_input_vizualization) {
                        const color_pickier = sb(ordinary_color_input_inner, '.pcr-app');
                        const { family, name } = e.target.dataset;
                        const color_pickier_hidden =
                            !inputs_data.obj[family][name].color_pickier_is_visible;
                        const clicked_on_same_color_input_vizualization_second_time =
                            previously_opened_color_pickier === color_pickier;

                        if (
                            color_pickier_hidden &&
                            !clicked_on_same_color_input_vizualization_second_time
                        ) {
                            const body_margin_bottom = parseInt(
                                window.getComputedStyle(s('body')).marginBottom,
                                10,
                            );
                            const fieldset_border_width = parseInt(
                                window.getComputedStyle(s('fieldset')).borderWidth,
                                10,
                            );
                            const margin_bottom_of_body_plus_fieldset_border_width =
                                body_margin_bottom + fieldset_border_width;
                            mut.current_color_pickier.el = ordinary_color_input_inner;
                            mut.current_color_pickier.family = family;
                            mut.current_color_pickier.name = name;
                            mut.current_color_pickier.color =
                                inputs_data.obj[family][name].color ||
                                inputs_data.obj[family][name].val;
                            mut.previous_pickied_color = mut.current_color_pickier.color;

                            set_color_color_pickier_position(color_pickier, 'bottom', family, name);

                            change_color_pickier_display_status(family, name, true);

                            const color_pickier_is_fully_visible =
                                color_pickier.getBoundingClientRect().bottom <=
                                window.innerHeight -
                                    margin_bottom_of_body_plus_fieldset_border_width;

                            if (!color_pickier_is_fully_visible) {
                                set_color_color_pickier_position(
                                    color_pickier,
                                    'top',
                                    family,
                                    name,
                                );
                            }

                            analytics.send_event('color_pickiers', `showed-${family}-${name}`);
                        }
                    }
                } catch (er) {
                    err(er, 336);
                }
            };

            //> try to hide color pickier when clicking outside of color pickier t
            if (previously_opened_color_pickier) {
                // if current color pickier's current state exsist
                const clicked_outside_of_color_pickier = !mut.current_color_pickier.el.contains(
                    e.target,
                );

                if (clicked_outside_of_color_pickier) {
                    cancel_color_picking();
                }
            }
            //< try to hide color pickier when clicking outside of color pickier t

            try_to_show_color_pickier_when_clicking_on_color_input_vizualization();
        }
    } catch (er) {
        err(er, 31);
    }
};

//> accept color when clicking OK t
export const accept_color = (family, name) => {
    try {
        const was_default = inputs_data.obj[family][name].default;
        const was_disabled = Boolean(inputs_data.obj[family][name].disabled);
        const app_theme = store.get('theme');
        const from_rgba_string =
            mut.previous_pickied_color === options.ob.theme_vals[app_theme].color_input_default ||
            mut.previous_pickied_color === options.ob.theme_vals[app_theme].color_input_disabled
                ? null
                : mut.previous_pickied_color;

        const to_rgba_string = convert_rgba_arr_into_string(mut.current_pickied_color);
        let from_manifest_val;
        let to_manifest_val;

        if (family === 'images' || name === 'icon') {
            const hex = tinycolor(to_rgba_string).toHex();
            let history_obj;

            if (conds.imgs(family, name)) {
                history_obj = history.record_change(() =>
                    history.generate_img_history_obj(
                        family,
                        name,
                        was_default,
                        mut.current_pickied_color,
                        false,
                    ),
                );
            }

            imgs.create_solid_color_image(
                family,
                name,
                hex,
                mut.current_pickied_color[mut.current_pickied_color.length - 1],
                history_obj,
            );

            change_val.change_val(family, name, name, null, true, true);

            picked_colors.record_picked_color(family, name);
        } else if (family === 'colors') {
            if (from_rgba_string) {
                from_manifest_val = convert_rgba_string_into_rounded_arr(from_rgba_string);
            }

            if (to_rgba_string) {
                to_manifest_val = convert_rgba_string_into_rounded_arr(to_rgba_string);
            }

            change_val.change_val(family, name, to_manifest_val, null, true, true);
        } else if (family === 'tints') {
            if (from_rgba_string) {
                from_manifest_val = convert_rgba_string_to_hsl_arr(from_rgba_string);
            }

            if (to_rgba_string) {
                to_manifest_val = convert_rgba_string_to_hsl_arr(to_rgba_string);
            }

            change_val.change_val(family, name, to_manifest_val, null, true, true);
        }

        change_color_pickier_display_status(family, name, false);

        if (family !== 'images') {
            change_val.set_inputs_data_val(family, name, to_rgba_string);
        }

        mut.current_color_pickier.el = null;

        if (conds.colors(family)) {
            history.record_change(() =>
                history.generate_color_history_obj(
                    family,
                    name,
                    was_default,
                    was_disabled,
                    from_rgba_string,
                    from_manifest_val,
                    to_rgba_string,
                    mut.current_pickied_color,
                    to_manifest_val,
                    false,
                ),
            );
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

export const close_or_open_color_pickier_by_keyboard = (e) => {
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

const focus_input_and_select_all_text_in_it_inner = async (input) => {
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

export const focus_input_and_select_all_text_in_it = (color_pickier_w) => {
    try {
        const color_val_input = sb(color_pickier_w, '.pcr-result');

        focus_input_and_select_all_text_in_it_inner(color_val_input);
    } catch (er) {
        err(er, 183);
    }
};

export const defocus_color_field = () => {
    try {
        document.activeElement.blur();
    } catch (er) {
        err(er, 185);
    }
};

export const convert_picked_colors_from_objects_to_arrays = (files) => {
    try {
        const files_to_update = files.filter((file) => {
            const file_name = basename(file);

            return file_name === 'picked_colors.json';
        });

        for (const file of files_to_update) {
            const picked_colors_obj = json_file.parse_json(file);

            const inner = () => {
                try {
                    if (picked_colors_obj) {
                        for (const family of Object.keys(picked_colors_obj)) {
                            for (const name of Object.keys(picked_colors_obj[family])) {
                                picked_colors_obj[family][name] = Object.values(
                                    picked_colors_obj[family][name],
                                );
                            }
                        }
                    }
                } catch (er) {
                    err(er, 307);
                }
            };

            inner();

            if (picked_colors_obj) {
                json_file.write_to_json(picked_colors_obj, file);
            }
        }
    } catch (er) {
        err(er, 307);
    }
};
