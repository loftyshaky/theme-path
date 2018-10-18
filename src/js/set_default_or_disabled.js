'use_strict';

import * as shared from 'js/shared';
import * as change_val from 'js/change_val'
import { inputs_data } from 'js/inputs_data';

import { action, configure } from "mobx";
import * as r from 'ramda';
const { existsSync, unlinkSync, writeFileSync } = require('fs');

configure({ enforceActions: 'observed' });

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

            inputs_data.obj[family][i].val = shared.sta.black;

        } else {
            inputs_data.obj[family][i].disable = false;
            inputs_data.obj[family][i].default = true;

            set_default(family, i, 'default');
        }
    }
});

const set_default = (family, i) => {
    const key_to_delete = inputs_data.obj[family][i].name;

    delete shared.mut.manifest.theme[family][key_to_delete];

    if (r.isEmpty(shared.mut.manifest.theme[family])) {
        delete shared.mut.manifest.theme[family];
    }

    const new_json = JSON.stringify(shared.mut.manifest);
    const img_to_delete_path = shared.ob.chosen_folder_path + '\\' + inputs_data.obj[family][i].val;

    if (existsSync(img_to_delete_path)) {
        unlinkSync(shared.ob.chosen_folder_path + '\\' + inputs_data.obj[family][i].val);
    }

    writeFileSync(shared.ob.chosen_folder_path + '\\manifest.json', new_json, 'utf8');

    inputs_data.obj[family][i].color ? inputs_data.obj[family][i].color = shared.sta.yellow : inputs_data.obj[family][i].val = shared.sta.yellow
};