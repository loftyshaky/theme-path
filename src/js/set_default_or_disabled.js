'use_strict';

import { join } from 'path';
import { existsSync, unlinkSync, copySync } from 'fs-extra';

import * as r from 'ramda';
import Store from 'electron-store';

import * as shared from 'js/shared';
import * as json_file from 'js/json_file';
import * as options from 'js/options';
import * as change_val from 'js/change_val';
import { inputs_data } from 'js/inputs_data';
import * as choose_folder from 'js/work_folder/choose_folder';

const store = new Store();

//--

export const set_default_icon = (family, name) => {
    try {
        //> set default icon name
        change_val.set_default_bool(family, name, true);

        shared.construct_icons_obj(shared.mut.manifest);

        shared.mut.manifest.icons['128'] = 'icon.png';

        json_file.write_to_json(shared.mut.manifest, join(shared.ob.chosen_folder_path, 'manifest.json'));
        //< set default icon name

        //> copy default icon
        const icon_paths = shared.get_icon_paths();

        copySync(icon_paths.source, icon_paths.target);
        //< copy default icon

        //> restore default color_input_vizualization color
        const { color_input_default } = options.ob.theme_vals[store.get('theme')];

        change_val.set_inputs_data_color(family, name, color_input_default);
        //< restore default color_input_vizualization color

    } catch (er) {
        err(er, 49);
    }
};

export const set_default_or_disabled = (family, name, special_checkbox) => {
    try {
        if (choose_folder.reset_work_folder(false)) {
            if (special_checkbox === 'default') {
                if (!inputs_data.obj[family][name].default) {
                    change_val.set_default_bool(family, name, true);

                    if (family === 'tints') {
                        change_val.set_disabled_bool(family, name, false);
                    }

                    set_default(family, name, special_checkbox);
                }

            } else if (special_checkbox === 'select') {
                set_default(family, name, special_checkbox);

            } else if (special_checkbox === 'disabled') {
                if (!inputs_data.obj[family][name].disabled) {
                    change_val.set_disabled_bool(family, name, true);
                    change_val.set_default_bool(family, name, false);

                    change_val.change_val(family, name, [-1, -1, -1], null);

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

        delete shared.mut.manifest.theme[family][name];

        if (r.isEmpty(shared.mut.manifest.theme[family])) {
            delete shared.mut.manifest.theme[family];
        }

        const img_to_delete_path = join(shared.ob.chosen_folder_path, inputs_data.obj[family][name].val);

        if (existsSync(img_to_delete_path)) {
            try {
                unlinkSync(img_to_delete_path);

            } catch (er) {
                err(er, 139, 'img_is_locked');
            }
        }

        json_file.write_to_json(shared.mut.manifest, join(shared.ob.chosen_folder_path, 'manifest.json'));

        if (inputs_data.obj[family][name].color) {
            change_val.set_inputs_data_color(family, name, color_input_default);

        } else {
            change_val.set_inputs_data_val(family, name, color_input_default);
        }

    } catch (er) {
        err(er, 51);
    }
};
