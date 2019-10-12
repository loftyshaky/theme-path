'use_strict';

import { join } from 'path';
import { existsSync, copySync, removeSync } from 'fs-extra';

import * as r from 'ramda';
import { observable, action, toJS, configure } from 'mobx';
import Store from 'electron-store';

import x from 'x';
import { inputs_data, set_inputs_data } from 'js/inputs_data';
import * as analytics from 'js/analytics';
import * as chosen_folder_path from 'js/chosen_folder_path';
import * as manifest from 'js/manifest';
import * as json_file from 'js/json_file';
import * as change_val from 'js/change_val';
import * as color_pickiers from 'js/color_pickiers';
import * as set_default_or_disabled from 'js/set_default_or_disabled';
import * as picked_colors from 'js/picked_colors';
import * as options from 'js/options';
import * as conds from 'js/conds';
import * as processing_msg from 'js/processing_msg';
import * as new_theme_or_rename from 'js/work_folder/new_theme_or_rename';
import * as folders from 'js/work_folder/folders';

configure({ enforceActions: 'observed' });
const store = new Store();

export const load_history = () => {
    try {
        folders.check_if_selected_folder_is_theme(() => {
            try {
                mut.scroll_to_bottom_of_history = true;
                mut.initial_inputs_data = toJS(inputs_data.obj);

                show_or_hide_history(true);
                set_history();

            } catch (er) {
                err(er, 204);
            }
        });

    } catch (er) {
        err(er, 203);
    }
};

export const accept_history_change = () => {
    processing_msg.process(() => {
        try {
            manifest.reload_manifest();

            const number_of_changes = mut.changes_to_revert.length;
            const clicked_on_last_item = number_of_changes === 0;

            if (!clicked_on_last_item) {
                let updated_name = false;

                for (const change of mut.changes_to_revert) {
                    const { family, name, locale, from, from_manifest_val, from_img_id, from_picked_color_val, was_default, was_disabled } = change;

                    if (conds.imgs(family, name)) {
                        const path_to_current_img = join(chosen_folder_path.ob.chosen_folder_path, `${name}.png`);

                        if (!was_default) {
                            change_val.change_val(family, name, name, '.png', false);

                            if (from_img_id) {
                                const path_to_old_img = join(chosen_folder_path.ob.chosen_folder_path, con.old_imgs_path, `${from_img_id}.png`);
                                copySync(path_to_old_img, path_to_current_img);

                                removeSync(path_to_old_img);
                            }

                        } else {
                            change_val.set_default_bool(family, name, true);
                            picked_colors.remove_picked_color(family, name);
                            removeSync(path_to_current_img);

                            if (name !== 'icon') {
                                set_default_or_disabled.delete_key_from_manifest(family, name);

                            } else {
                                set_default_or_disabled.set_default_icon(family, name);
                            }
                        }

                    } else if (conds.colors(family)) {
                        if (!was_default) {
                            if (!manifest.mut.manifest.theme[family]) {
                                manifest.mut.manifest.theme[family] = {};
                            }

                            if (!was_disabled) {
                                manifest.mut.manifest.theme[family][name] = from_manifest_val;

                            } else {
                                manifest.mut.manifest.theme[family][name] = set_default_or_disabled.con.disabled_manifest_val;
                            }

                        } else {
                            picked_colors.remove_picked_color(family, name);
                            set_default_or_disabled.delete_key_from_manifest(family, name);
                        }

                    } else if (conds.selects(family, name)) {
                        if (!was_default) {
                            change_val.change_val(family, name, from, null, false);

                        } else {
                            set_default_or_disabled.set_default_or_disabled(family, name, 'select');
                        }

                    } else if (conds.textareas(family, name)) {
                        if (name === 'version') {
                            change_val.change_val(family, name, from, null, false);
                            change_val.set_previous_val(family, name, from);

                        } else {
                            if (name === 'name') {
                                updated_name = true;
                            }

                            change_val.update_name_or_description(name, from, locale);
                        }

                    }

                    if (conds.imgs(family, name) || conds.colors(family)) {
                        if (from_picked_color_val) {
                            color_pickiers.mut.current_pickied_color = from_picked_color_val;

                            picked_colors.record_picked_color(family, name);

                        } else {
                            picked_colors.remove_picked_color(family, name);
                        }
                    }
                }

                change_val.set_previous_val('theme_metadata', 'name', inputs_data.obj.theme_metadata.name.val);
                change_val.set_previous_val('theme_metadata', 'description', inputs_data.obj.theme_metadata.description.val);

                const history_arr = toJS(r.dropLast(number_of_changes, ob.history));

                json_file.write_to_json(history_arr, get_history_path());
                json_file.write_to_manifest_json();

                const new_folder_name = inputs_data.obj.theme_metadata.name.val;
                const locale = inputs_data.obj.theme_metadata.locale.val;
                const default_locale = inputs_data.obj.theme_metadata.default_locale.val;

                if (updated_name && locale === default_locale) {
                    new_theme_or_rename.rename_theme_folder(chosen_folder_path.ob.chosen_folder_path, new_folder_name);
                }
            }

            change_revert_position(Infinity);
            show_or_hide_history(false);

            analytics.add_history_analytics('history_accept');

        } catch (er) {
            err(er, 205);
        }
    });
};

export const cancel_history_change = () => {
    try {
        set_inputs_data(mut.initial_inputs_data);
        change_revert_position(Infinity);
        show_or_hide_history(false);

    } catch (er) {
        err(er, 206);
    }
};

export const generate_img_history_obj = (family, name, was_default, to_rgba, set_to_default, target_folder_path) => {
    try {
        const from_img_path = join(target_folder_path || chosen_folder_path.ob.chosen_folder_path, `${name}.png`);
        const from_img_id = Date.now();
        const copy_img = existsSync(from_img_path) && (name !== 'icon' || (name === 'icon' && !was_default));

        if (copy_img) {
            copySync(
                from_img_path,
                join(target_folder_path || chosen_folder_path.ob.chosen_folder_path, con.old_imgs_path, `${from_img_id}.png`),
            );
        }

        const from_picked_color_val = get_from_picked_color_val(family, name, target_folder_path);

        const rgba_css_val = r.ifElse(
            () => to_rgba,
            () => conver_rgba_arr_into_css_val(to_rgba),

            () => null,
        )();

        return {
            family,
            name,
            was_default,
            ...(copy_img && { from_img_id }),
            ...(from_picked_color_val && { from_picked_color_val }),
            ...(rgba_css_val && { to_rgba: rgba_css_val }),
            set_to_default,
            timestamp: get_timestamp(),
        };

    } catch (er) {
        err(er, 225);
    }

    return undefined;
};

export const generate_color_history_obj = (family, name, was_default, was_disabled, from_hex, from_manifest_val, to_hex, set_to_default, set_to_disabled, target_folder_path) => {
    const from_picked_color_val = get_from_picked_color_val(family, name, target_folder_path);

    try {
        return {
            family,
            name,
            was_default,
            was_disabled,
            ...(from_hex && { from_hex }),
            ...(from_manifest_val && { from_manifest_val }),
            ...(from_picked_color_val && { from_picked_color_val }),
            to_hex,
            set_to_default,
            set_to_disabled,
            timestamp: get_timestamp(),
        };

    } catch (er) {
        err(er, 222);
    }

    return undefined;
};

export const generate_select_history_obj = (family, name, was_default, from, to, set_to_default) => {
    try {
        return {
            family,
            name,
            was_default,
            from: from !== null ? from.toString() : null,
            to: to.toString(),
            set_to_default,
            timestamp: get_timestamp(),
        };

    } catch (er) {
        err(er, 222);
    }

    return undefined;
};


export const generate_textarea_history_obj = (family, name, from, to, locale) => {
    try {
        return {
            family,
            name,
            ...((name === 'name' || name === 'description') && { locale: locale || inputs_data.obj.theme_metadata.locale.val }),
            from,
            to,
            timestamp: get_timestamp(),
        };

    } catch (er) {
        err(er, 224);
    }

    return undefined;
};

export const record_change = (generate_history_obj_f, target_folder_path) => {
    try {
        const max_number_of_history_records = store.get('max_number_of_history_records');
        const is_digit = /^\d+$/.test(max_number_of_history_records); // true even if number is of type string

        if (is_digit && max_number_of_history_records > 0) {
            const history_arr = get_history_arr(target_folder_path);
            const history_path = get_history_path(target_folder_path);

            const history_obj = generate_history_obj_f();

            history_arr.push(history_obj);

            while (history_arr.length > max_number_of_history_records) {
                const { from_img_id } = history_arr[0];

                if (from_img_id) { // is image record with image in old_imgs folder
                    const path_to_img_to_delete = join(target_folder_path || chosen_folder_path.ob.chosen_folder_path, con.old_imgs_path, `${from_img_id}.png`);

                    removeSync(path_to_img_to_delete);
                }

                history_arr.shift();
            }

            json_file.create_json_file(history_path, '[]');
            json_file.write_to_json(history_arr, history_path);
        }
    } catch (er) {
        err(er, 223);
    }
};

const get_timestamp = () => new Date().getTime();

const get_history_arr = target_folder_path => {
    try {
        const history_path = get_history_path(target_folder_path);

        const history_arr = r.ifElse(
            () => existsSync(history_path),
            () => json_file.parse_json(history_path),

            () => [],
        )();

        return history_arr;

    } catch (er) {
        err(er, 200);
    }

    return undefined;
};

const get_history_path = target_folder_path => join(target_folder_path || chosen_folder_path.ob.chosen_folder_path, con.history_path);

export const get_date_from_timestamp = timestamp => {
    try {
        const obj = new Date(timestamp);
        const year = obj.getFullYear();
        const month = con.months[obj.getMonth()];
        const date = obj.getDate();
        const hour = obj.getHours();
        const min = obj.getMinutes() < 10 ? `0${obj.getMinutes()}` : obj.getMinutes();
        const sec = obj.getSeconds() < 10 ? `0${obj.getSeconds()}` : obj.getSeconds();
        const time = `${date} ${month} ${year} ${hour}:${min}:${sec}`;

        return time;

    } catch (er) {
        err(er, 208);
    }

    return undefined;
};

export const revert_tinker = revert_position => {
    try {
        change_revert_position(revert_position);
        set_inputs_data(mut.initial_inputs_data);

        mut.changes_to_revert = r.drop(revert_position, ob.history).reverse();

        const clicked_on_last_item = mut.changes_to_revert.length === 0;

        if (!clicked_on_last_item) {
            for (const change of mut.changes_to_revert) {
                const { family, name, locale, from, from_hex, from_picked_color_val, was_default, was_disabled } = change;

                if (conds.imgs(family, name)) {
                    const color = r.ifElse(
                        () => from_picked_color_val,
                        () => conver_rgba_arr_into_css_val(from_picked_color_val),

                        () => options.ob.theme_vals[store.get('theme')].color_input_default,
                    )();

                    color_pickiers.set_color_input_vizualization_color(family, name, color);

                } else if (conds.colors(family)) {
                    color_pickiers.set_color_input_vizualization_color(family, name, from_hex || options.ob.theme_vals[options.ob.theme].color_input_default);

                    change_val.set_default_bool(family, name, was_default);

                    if (family === 'tints') {
                        change_val.set_disabled_bool(family, name, was_disabled);
                    }

                } else if (conds.selects(family, name)) {
                    change_val.set_inputs_data_val(family, name, from);

                } else if (conds.textareas(family, name)) {
                    if (locale === inputs_data.obj.theme_metadata.locale.val || name === 'version') {
                        change_val.set_inputs_data_val(family, name, from);
                    }
                }

                if (conds.colors(family) || conds.imgs(family, name)) {
                    change_val.set_default_bool(family, name, was_default);
                }
            }
        }

        analytics.add_history_analytics('history_item');

    } catch (er) {
        err(er, 209);
    }
};

const get_from_picked_color_val = (family, name, target_folder_path) => {
    try {
        const picked_colors_path = join(target_folder_path || chosen_folder_path.ob.chosen_folder_path, picked_colors.con.picked_colors_sdb_path);
        let from_picked_color_val;

        if (existsSync(picked_colors_path)) {
            const picked_colors_obj = json_file.parse_json(picked_colors_path);

            if (picked_colors_obj[family] && picked_colors_obj[family][name]) {
                from_picked_color_val = picked_colors_obj[family][name];
            }
        }

        return from_picked_color_val;

    } catch (er) {
        err(er, 263);
    }

    return undefined;
};

export const show_or_hide_history = action(bool => {
    try {
        ob.history_is_visible = bool;

    } catch (er) {
        err(er, 199);
    }
});

const set_history = action(() => {
    try {
        ob.history = get_history_arr();

        get_changes_to_revert(ob.history.length);

    } catch (er) {
        err(er, 210);
    }
});

const change_revert_position = action(revert_position => {
    try {
        ob.revert_position = revert_position;

    } catch (er) {
        err(er, 211);
    }
});

const get_changes_to_revert = revert_position => {
    try {
        mut.changes_to_revert = r.drop(revert_position, ob.history).reverse();

    } catch (er) {
        err(er, 221);
    }
};

export const set_history_side_popup_width = () => {
    try {
        s('.history_side_popup').style.width = `${store.get('history_side_popup_width')}px`;

    } catch (er) {
        err(er, 213);
    }
};

const conver_rgba_arr_into_css_val = to_rgba => `rgba(${r.values(to_rgba).join(',')})`;

export const met = {
    reset_history_side_popup_content: null,
};

const con = {
    history_path: join('system', 'history.json'),
    old_imgs_path: join('system', 'old_imgs'),
    months: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].map(month => x.msg(month)),
};

export const mut = {
    changes_to_revert: null,
    initial_inputs_data: null,
    scroll_to_bottom_of_history: false,
};

export const ob = observable({
    history: [],
    history_is_visible: false,
    revert_position: Infinity,
    reset_history_side_popup_content: null,
});
