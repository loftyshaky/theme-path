'use_strict';

import { join } from 'path';
import { existsSync, unlinkSync, copySync, readdirSync } from 'fs-extra';

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
import * as choose_folder from 'js/work_folder/choose_folder';
import * as folders from 'js/work_folder/folders';

const store = new Store();

export const set_default_icon = (family, name, target_path, target_mainifest_oobj) => {
    try {
        const theme_path = target_path || chosen_folder_path.ob.chosen_folder_path;
        const manifest_obj = target_mainifest_oobj || manifest.mut.manifest;

        imgs.remove_img_by_name(name, theme_path);

        history.record_change(() => history.generate_img_history_obj(family, name, false, null, true, theme_path), theme_path);

        //> set default icon name
        change_val.set_default_bool(family, name, true);

        icons.construct_icons_obj(manifest_obj);

        manifest_obj.icons['128'] = 'icon.png';

        json_file.write_to_json(manifest_obj, join(theme_path, 'manifest.json'));
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

    } catch (er) {
        err(er, 49);
    }
};

export const set_default_or_disabled = (family, name, special_checkbox, force_set, was_default, was_disabled, previous_color, previous_manifest_val, target_path, manifest_obj) => {
    try {
        if (choose_folder.reset_work_folder(false)) {
            const theme_path = target_path || chosen_folder_path.ob.chosen_folder_path;

            if (special_checkbox === 'default') {
                if (!inputs_data.obj[family][name].default || force_set) {
                    if (conds.imgs(family, name)) {
                        history.record_change(() => history.generate_img_history_obj(family, name, false, null, true, theme_path), theme_path);
                    }

                    if (conds.colors(family)) {
                        const previous_color_obj = get_previous_color(family, name);

                        history.record_change(
                            () => history.generate_color_history_obj(
                                family,
                                name,
                                false,
                                was_disabled || Boolean(inputs_data.obj[family][name].disabled),
                                previous_color || previous_color_obj.previous_color,
                                previous_manifest_val || previous_color_obj.previous_manifest_val,
                                null,
                                true,
                                false,
                                target_path,
                            ), target_path,
                        );
                    }

                    change_val.set_default_bool(family, name, true);

                    if (family === 'tints') {
                        change_val.set_disabled_bool(family, name, false);
                    }

                    set_default(family, name, target_path, manifest_obj);

                    picked_colors.remove_picked_color(family, name, theme_path);
                }

            } else if (special_checkbox === 'select') {
                set_default(family, name, target_path, manifest_obj);

            } else if (special_checkbox === 'disabled') {
                if (!inputs_data.obj[family][name].disabled || force_set) {
                    const previous_color_obj = get_previous_color(family, name);
                    const disabled_color = options.ob.theme_vals[store.get('theme')].color_input_disabled;

                    history.record_change(
                        () => history.generate_color_history_obj(
                            family,
                            name,
                            was_default || inputs_data.obj[family][name].default,
                            false,
                            previous_color || previous_color_obj.previous_color,
                            previous_manifest_val || previous_color_obj.previous_manifest_val,
                            null,
                            false,
                            true,
                            target_path,
                        ), target_path,
                    );

                    change_val.set_disabled_bool(family, name, true);
                    change_val.set_default_bool(family, name, false);

                    change_val.change_val(family, name, con.disabled_manifest_val, null, !force_set, theme_path);

                    change_val.set_inputs_data_val(family, name, disabled_color);
                    color_pickiers.set_color_input_vizualization_color(family, name, disabled_color);

                } else {
                    change_val.set_disabled_bool(family, name, false);
                    change_val.set_disabled_bool(family, name, false);
                    change_val.set_default_bool(family, name, true);

                    set_default(family, name);
                }
            }
        }

    } catch (er) {
        err(er, 50);
    }
};

const set_default = (family, name, target_path, manifest_obj) => {
    try {
        const { color_input_default } = options.ob.theme_vals[store.get('theme')];
        let clear_new_tab_video_name = '';
        let new_manifest_obj;

        if (name !== 'clear_new_tab_video') {
            new_manifest_obj = delete_key_from_manifest(family, name, manifest_obj);

        } else {
            const files = readdirSync(target_path || chosen_folder_path.ob.chosen_folder_path);
            clear_new_tab_video_name = files.find(file => file.indexOf('clear_new_tab_video') > -1) || '';
        }

        const img_name = folders.find_file_with_exist(name, target_path) || inputs_data.obj[family][name].val || clear_new_tab_video_name;
        const file_to_delete_path = join(target_path || chosen_folder_path.ob.chosen_folder_path, img_name);

        if (existsSync(file_to_delete_path) && img_name) {
            try {
                unlinkSync(file_to_delete_path);

            } catch (er) {
                err(er, 139, 'img_is_locked');
            }
        }

        json_file.write_to_manifest_json(target_path, new_manifest_obj);

        if (inputs_data.obj[family][name].type === 'select') {
            change_val.set_inputs_data_val(family, name, 'default');

        } else if (inputs_data.obj[family][name].color) {
            change_val.set_inputs_data_color(family, name, color_input_default);

        } else {
            change_val.set_inputs_data_val(family, name, color_input_default);
        }

    } catch (er) {
        err(er, 51);
    }
};

export const delete_key_from_manifest = (family, name, manifest_obj) => {
    try {
        const new_manifest_obj = manifest_obj || manifest.mut.manifest;

        if (new_manifest_obj.theme && new_manifest_obj.theme[family] && new_manifest_obj.theme[family][name]) {
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

const get_previous_color = (family, name) => {
    try {
        const previous_color = inputs_data.obj[family][name].color || inputs_data.obj[family][name].val;

        const previous_manifest_val = r.ifElse(
            () => family === 'colors',
            () => previous_color,

            () => color_pickiers.convert_rgba_strings_to_tint_val(previous_color),
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

export const con = {
    disabled_manifest_val: [-1, -1, -1],
};
