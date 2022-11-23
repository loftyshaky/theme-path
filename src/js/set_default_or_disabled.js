import { copySync } from 'fs-extra';

import * as r from 'ramda';
import Store from 'electron-store';

import * as manifest from 'js/manifest';
import * as json_file from 'js/json_file';
import * as chosen_folder_path from 'js/chosen_folder_path';
import * as picked_colors from 'js/picked_colors';
import * as imgs from 'js/imgs';
import * as icons from 'js/icons';
import * as options from 'js/options';
import * as change_val from 'js/change_val';
import { inputs_data } from 'js/inputs_data';
import * as history from 'js/history';
import * as color_pickiers from 'js/color_pickiers';
import * as conds from 'js/conds';
import * as tints from 'js/tints';
import * as choose_folder from 'js/work_folder/choose_folder';

const store = new Store();

const get_previous_color = (family, name) => {
    try {
        const previous_color =
            inputs_data.obj[family][name].color || inputs_data.obj[family][name].val;

        const previous_manifest_val = r.ifElse(
            () => family === 'colors',
            () => color_pickiers.convert_rgba_string_into_rounded_arr(previous_color),

            () => color_pickiers.convert_rgba_string_to_hsl_arr(previous_color),
        )();

        return {
            previous_color,
            previous_manifest_val,
        };
    } catch (er) {
        err(er, 261);
    }

    return undefined;
};

export const delete_key_from_manifest = (family, name, manifest_obj) => {
    try {
        const new_manifest_obj = manifest_obj || manifest.mut.manifest;

        if (
            new_manifest_obj.theme &&
            new_manifest_obj.theme[family] &&
            !r.isNil(new_manifest_obj.theme[family][name])
        ) {
            delete new_manifest_obj.theme[family][name];

            if (r.isEmpty(new_manifest_obj.theme[family])) {
                delete new_manifest_obj.theme[family];
            }
        }

        return new_manifest_obj;
    } catch (er) {
        err(er, 260);
    }

    return undefined;
};

const set_default = (family, name, target_path, manifest_obj) => {
    try {
        const { color_input_default } = options.ob.theme_vals[store.get('theme')];
        let new_manifest_obj;

        if (name !== 'clear_new_tab_video') {
            new_manifest_obj = delete_key_from_manifest(family, name, manifest_obj);
        }

        if (family === 'images' || name === 'clear_new_tab_video') {
            imgs.remove_img_by_name(name, target_path);
        }

        if (name !== 'clear_new_tab_video') {
            json_file.write_to_manifest_json(target_path, new_manifest_obj);
        }

        if (inputs_data.obj[family][name].type === 'select') {
            change_val.set_inputs_data_val(family, name, 'default');
        } else if (['colors', 'images'].includes(family)) {
            change_val.set_inputs_data_color(family, name, color_input_default);
        } else if (family === 'tints') {
            change_val.set_inputs_data_val(family, name, tints.con.default_val);
        } else if (conds.textareas_with_default_checkbox(family, name)) {
            change_val.set_inputs_data_val(family, name, '');
        }

        imgs.get_dims(family, name);
    } catch (er) {
        err(er, 51);
    }
};

export const set_default_icon = (
    family,
    name,
    remove_reverted_history,
    target_path,
    target_mainifest_obj,
) => {
    try {
        if (remove_reverted_history) {
            history.remove_reverted_history();
        }

        const theme_path = target_path || chosen_folder_path.ob.chosen_folder_path;
        const manifest_obj = target_mainifest_obj || manifest.mut.manifest;

        history.record_change(
            () => history.generate_img_history_obj(family, name, false, null, true, theme_path),
            theme_path,
        );

        imgs.remove_img_by_name(name, theme_path);

        //> set default icon name
        change_val.set_default_bool(family, name, true);

        icons.construct_icons_obj(manifest_obj);

        manifest_obj.icons['128'] = 'icon.png';

        json_file.write_to_manifest_json(theme_path, manifest_obj);
        //< set default icon name

        //> copy default icon
        const icon_paths = icons.get_icon_paths(target_path);

        copySync(icon_paths.source, icon_paths.target);
        //< copy default icon

        //> restore default color_input_vizualization color

        if (!target_path) {
            const { color_input_default } = options.ob.theme_vals[store.get('theme')];

            change_val.set_inputs_data_color(family, name, color_input_default);
        }
        //< restore default color_input_vizualization color

        picked_colors.remove_picked_color(family, name);
        imgs.get_dims(family, name);
    } catch (er) {
        err(er, 49);
    }
};

export const set_default_or_disabled = (
    family,
    name,
    special_checkbox,
    remove_reverted_history,
    force_set,
    was_default,
    was_disabled,
    previous_color,
    previous_manifest_val,
    target_path,
    manifest_obj,
) => {
    const set_default_or_disabled_inner = () => {
        try {
            const theme_path = target_path || chosen_folder_path.ob.chosen_folder_path;

            if (special_checkbox === 'default') {
                if (!inputs_data.obj[family][name].default || force_set) {
                    if (conds.imgs(family, name)) {
                        history.record_change(
                            () =>
                                history.generate_img_history_obj(
                                    family,
                                    name,
                                    false,
                                    null,
                                    true,
                                    theme_path,
                                ),
                            theme_path,
                        );
                    }

                    if (conds.colors(family)) {
                        const previous_color_obj = get_previous_color(family, name);

                        history.record_change(
                            () =>
                                history.generate_color_history_obj(
                                    family,
                                    name,
                                    false,
                                    was_disabled || Boolean(inputs_data.obj[family][name].disabled),
                                    family === 'tints'
                                        ? inputs_data.obj.tints[name].val
                                        : previous_color || previous_color_obj.previous_color,
                                    family === 'tints'
                                        ? null
                                        : previous_manifest_val ||
                                              previous_color_obj.previous_manifest_val,
                                    null,
                                    null,
                                    null,
                                    true,
                                    false,
                                    theme_path,
                                ),
                            theme_path,
                        );
                    } else if (conds.textareas_with_default_checkbox(family, name)) {
                        history.record_change(
                            () =>
                                history.generate_textarea_history_obj(
                                    family,
                                    name,
                                    previous_manifest_val || inputs_data.obj[family][name].val,
                                    undefined,
                                    undefined,
                                    false,
                                    true,
                                ),
                            theme_path,
                        );
                    }

                    change_val.set_default_bool(family, name, true);

                    if (family === 'tints') {
                        change_val.set_disabled_bool(family, name, false);
                    }

                    set_default(family, name, theme_path, manifest_obj);

                    picked_colors.remove_picked_color(family, name, theme_path);
                }
            } else if (special_checkbox === 'select') {
                set_default(family, name, theme_path, manifest_obj);
            } else if (special_checkbox === 'disabled') {
                if (!inputs_data.obj[family][name].disabled || force_set) {
                    history.record_change(
                        () =>
                            history.generate_color_history_obj(
                                family,
                                name,
                                was_default || inputs_data.obj[family][name].default,
                                false,
                                inputs_data.obj[family][name].val,
                                null,
                                null,
                                null,
                                null,
                                false,
                                true,
                                theme_path,
                            ),
                        theme_path,
                    );

                    change_val.set_disabled_bool(family, name, true);
                    change_val.set_default_bool(family, name, false);

                    change_val.change_val(
                        family,
                        name,
                        tints.con.disabled_val,
                        null,
                        !force_set,
                        false,
                        theme_path,
                    );

                    change_val.set_inputs_data_val(family, name, tints.con.disabled_val);
                }
            }
        } catch (er) {
            err(er, 339);
        }
    };

    try {
        if (choose_folder.reset_work_folder(false)) {
            if (remove_reverted_history) {
                history.remove_reverted_history();
            }

            set_default_or_disabled_inner();
        }
    } catch (er) {
        err(er, 50);
    }
};
