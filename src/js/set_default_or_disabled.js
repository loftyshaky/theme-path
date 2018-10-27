'use_strict';

import * as shared from 'js/shared';
import * as settings from 'js/settings';
import * as change_val from 'js/change_val'
import { inputs_data } from 'js/inputs_data';

import { action, configure } from "mobx";
import * as r from 'ramda';
const Store = require('electron-store');
const { existsSync, unlinkSync, copySync } = require('fs-extra');
const { join } = require('path');

const store = new Store();

configure({ enforceActions: 'observed' });

export const set_default_icon = action((family, i) => {
    //> set default icon name
    inputs_data.obj[family][i].default = true;

    shared.construct_icons_obj(shared.mut.manifest);

    shared.mut.manifest.icons['128'] = 'icon.png'

    shared.write_to_json(shared.mut.manifest, join(shared.ob.chosen_folder_path, 'manifest.json'));
    //< set default icon name

    //> copy default icon
    const icon_paths = shared.get_icon_paths();

    copySync(icon_paths.source, icon_paths.target);
    //< copy default icon

    //> restore default color_input_vizualization color
    const color_input_default = settings.ob.theme_vals[store.get('theme')].color_input_default;

    inputs_data.obj[family][i].color = color_input_default;
    //< restore default color_input_vizualization color
});

export const set_default_or_disabled = action((family, i, special_checkbox) => {
    if (special_checkbox == 'default') {
        if (!inputs_data.obj[family][i].default) {
            inputs_data.obj[family][i].default = true;

            if (family == 'tints') {
                inputs_data.obj[family][i].disable = false;
            }

            set_default(family, i, special_checkbox);
        }

    } else if (special_checkbox == 'select') {
        set_default(family, i, special_checkbox);

    } else if (special_checkbox == 'disable') {
        if (!inputs_data.obj[family][i].disable) {
            inputs_data.obj[family][i].disable = true;
            inputs_data.obj[family][i].default = false;

            change_val.change_val(family, i, [-1, -1, -1], null);

            inputs_data.obj[family][i].val = settings.ob.theme_vals[store.get('theme')].color_input_disabled;

        } else {
            inputs_data.obj[family][i].disable = false;
            inputs_data.obj[family][i].default = true;

            set_default(family, i, 'default');
        }
    }
});

const set_default = (family, i) => {
    const color_input_default = settings.ob.theme_vals[store.get('theme')].color_input_default;
    const key_to_delete = inputs_data.obj[family][i].name;

    delete shared.mut.manifest.theme[family][key_to_delete];

    if (r.isEmpty(shared.mut.manifest.theme[family])) {
        delete shared.mut.manifest.theme[family];
    }

    const img_to_delete_path = join(shared.ob.chosen_folder_path, inputs_data.obj[family][i].val);

    if (existsSync(img_to_delete_path)) {
        unlinkSync(join(shared.ob.chosen_folder_path, inputs_data.obj[family][i].val));
    }

    shared.write_to_json(shared.mut.manifest, join(shared.ob.chosen_folder_path, 'manifest.json'));

    inputs_data.obj[family][i].color ? inputs_data.obj[family][i].color = color_input_default : inputs_data.obj[family][i].val = color_input_default
};