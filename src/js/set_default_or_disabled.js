'use_strict';

import { join } from 'path';
import { existsSync, unlinkSync, copySync } from 'fs-extra';

import * as r from 'ramda';
import Store from 'electron-store';

import * as shared from 'js/shared';
import * as settings from 'js/settings';
import * as change_val from 'js/change_val';
import { inputs_data } from 'js/inputs_data';
import * as choose_folder from 'js/work_folder/choose_folder';

const store = new Store();

//--

export const set_default_icon = (family, i) => {
    try {
        //> set default icon name
        change_val.set_default_bool(family, i, true);

        shared.construct_icons_obj(shared.mut.manifest);

        shared.mut.manifest.icons['128'] = 'icon.png';

        shared.write_to_json(shared.mut.manifest, join(shared.ob.chosen_folder_path, 'manifest.json'));
        //< set default icon name

        //> copy default icon
        const icon_paths = shared.get_icon_paths();

        copySync(icon_paths.source, icon_paths.target);
        //< copy default icon

        //> restore default color_input_vizualization color
        const { color_input_default } = settings.ob.theme_vals[store.get('theme')];

        change_val.set_inputs_data_color(family, i, color_input_default);
        //< restore default color_input_vizualization color

    } catch (er) {
        err(er, 49);
    }
};

export const set_default_or_disabled = (family, i, special_checkbox) => {
    try {
        if (choose_folder.reset_work_folder(false)) {
            if (special_checkbox === 'default') {
                if (!inputs_data.obj[family][i].default) {
                    change_val.set_default_bool(family, i, true);

                    if (family === 'tints') {
                        change_val.set_disable_bool(family, i, false);
                    }

                    set_default(family, i, special_checkbox);
                }

            } else if (special_checkbox === 'select') {
                set_default(family, i, special_checkbox);

            } else if (special_checkbox === 'disable') {
                if (!inputs_data.obj[family][i].disable) {
                    change_val.set_disable_bool(family, i, true);
                    change_val.set_default_bool(family, i, false);

                    change_val.change_val(family, i, [-1, -1, -1], null);

                    change_val.set_inputs_data_val(family, i, settings.ob.theme_vals[store.get('theme')].color_input_disabled);

                } else {
                    change_val.set_disable_bool(family, i, false);
                    change_val.set_disable_bool(family, i, false);
                    change_val.set_default_bool(family, i, true);

                    set_default(family, i, 'default');
                }
            }
        }

    } catch (er) {
        err(er, 50);
    }
};

const set_default = (family, i) => {
    try {
        const { color_input_default } = settings.ob.theme_vals[store.get('theme')];
        const name_to_delete = inputs_data.obj[family][i].name;

        delete shared.mut.manifest.theme[family][name_to_delete];

        if (r.isEmpty(shared.mut.manifest.theme[family])) {
            delete shared.mut.manifest.theme[family];
        }

        const img_to_delete_path = join(shared.ob.chosen_folder_path, inputs_data.obj[family][i].val);

        if (existsSync(img_to_delete_path)) {
            unlinkSync(join(shared.ob.chosen_folder_path, inputs_data.obj[family][i].val));
        }

        shared.write_to_json(shared.mut.manifest, join(shared.ob.chosen_folder_path, 'manifest.json'));

        if (inputs_data.obj[family][i].color) {
            change_val.set_inputs_data_color(family, i, color_input_default);

        } else {
            change_val.set_inputs_data_val(family, i, color_input_default);
        }

    } catch (er) {
        err(er, 51);
    }
};
