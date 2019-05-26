'use_strict';

import { join } from 'path';
import { existsSync, unlinkSync, copySync, readdirSync } from 'fs-extra';

import * as r from 'ramda';
import Store from 'electron-store';
import colorConvert from 'color-convert';

import * as manifest from 'js/manifest';
import * as json_file from 'js/json_file';
import * as chosen_folder_path from 'js/chosen_folder_path';
import * as picked_colors from 'js/picked_colors';
import * as icons from 'js/icons';
import * as options from 'js/options';
import * as change_val from 'js/change_val';
import { inputs_data } from 'js/inputs_data';
import * as history from 'js/history';
import * as color_pickiers from 'js/color_pickiers';
import * as choose_folder from 'js/work_folder/choose_folder';

const store = new Store();

export const set_default_icon = (family, name) => {
    try {
        history.record_change(() => history.generate_img_history_obj(family, name, false, null, true));

        //> set default icon name
        change_val.set_default_bool(family, name, true);

        icons.construct_icons_obj(manifest.mut.manifest);

        manifest.mut.manifest.icons['128'] = 'icon.png';

        json_file.write_to_manifest_json();
        //< set default icon name

        //> copy default icon
        const icon_paths = icons.get_icon_paths();

        copySync(icon_paths.source, icon_paths.target);
        //< copy default icon

        //> restore default color_input_vizualization color
        const { color_input_default } = options.ob.theme_vals[store.get('theme')];

        change_val.set_inputs_data_color(family, name, color_input_default);
        //< restore default color_input_vizualization color

        picked_colors.remove_picked_color(family, name);

    } catch (er) {
        err(er, 49);
    }
};

export const set_default_or_disabled = (family, name, special_checkbox) => {
    try {
        if (choose_folder.reset_work_folder(false)) {
            if (special_checkbox === 'default') {
                if (!inputs_data.obj[family][name].default) {
                    if (history.imgs_cond(family, name)) {
                        history.record_change(() => history.generate_img_history_obj(family, name, false, null, true));
                    }

                    if (history.colors_cond(family)) {
                        const previous_color = get_previous_color(family, name);

                        history.record_change(() => history.generate_color_history_obj(family, name, false, Boolean(inputs_data.obj[family][name].disabled), previous_color.previous_hex, previous_color.previous_manifest_val, null, true, false));
                    }

                    change_val.set_default_bool(family, name, true);

                    if (family === 'tints') {
                        change_val.set_disabled_bool(family, name, false);
                    }

                    set_default(family, name, special_checkbox);

                    picked_colors.remove_picked_color(family, name);
                }

            } else if (special_checkbox === 'select') {
                set_default(family, name, special_checkbox);

            } else if (special_checkbox === 'disabled') {
                if (!inputs_data.obj[family][name].disabled) {
                    const previous_color = get_previous_color(family, name);

                    history.record_change(() => history.generate_color_history_obj(family, name, inputs_data.obj[family][name].default, false, previous_color.previous_hex, previous_color.previous_manifest_val, null, false, true));

                    change_val.set_disabled_bool(family, name, true);
                    change_val.set_default_bool(family, name, false);

                    change_val.change_val(family, name, con.disabled_manifest_val, null);

                    change_val.set_inputs_data_val(family, name, options.ob.theme_vals[store.get('theme')].color_input_disabled);

                } else {
                    change_val.set_disabled_bool(family, name, false);
                    change_val.set_disabled_bool(family, name, false);
                    change_val.set_default_bool(family, name, true);

                    set_default(family, name, 'default');
                }
            }
        }

    } catch (er) {
        err(er, 50);
    }
};

const set_default = (family, name) => {
    try {
        const { color_input_default } = options.ob.theme_vals[store.get('theme')];
        let clear_new_tab_video_name = '';

        if (name !== 'clear_new_tab_video') {
            delete_key_from_manifest(family, name);

        } else {
            const files = readdirSync(chosen_folder_path.ob.chosen_folder_path);
            clear_new_tab_video_name = files.find(file => file.indexOf('clear_new_tab_video') > -1) || '';
        }

        const file_to_delete_path = join(chosen_folder_path.ob.chosen_folder_path, inputs_data.obj[family][name].val || clear_new_tab_video_name);

        if (existsSync(file_to_delete_path)) {
            try {
                unlinkSync(file_to_delete_path);

            } catch (er) {
                err(er, 139, 'img_is_locked');
            }
        }

        json_file.write_to_manifest_json();
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

export const delete_key_from_manifest = (family, name) => {
    delete manifest.mut.manifest.theme[family][name];

    if (r.isEmpty(manifest.mut.manifest.theme[family])) {
        delete manifest.mut.manifest.theme[family];
    }
};

const get_previous_color = (family, name) => {
    const previous_hex = inputs_data.obj[family][name].val;
    const previous_manifest_val = r.ifElse(
        () => family === 'colors',
        () => colorConvert.hex.rgb(previous_hex),

        () => color_pickiers.convert_hex_to_tints_val(previous_hex),
    )();

    return {
        previous_hex,
        previous_manifest_val,
    };
};

export const con = {
    disabled_manifest_val: [-1, -1, -1],
};
