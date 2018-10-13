'use_strict';

import * as shared from 'js/shared';
import { inputs_data } from 'js/inputs_data';

import { action, configure } from "mobx";
const { readFileSync, writeFileSync } = require('fs');

configure({ enforceActions: 'observed' });

export const change_val = action((family, i, e) => {
    inputs_data.obj[family][i].val = e.target.value;

    set_theme_prop(inputs_data.obj[family][i].name, e.target.value);
});

export const change_select_val = action((family, i, storage, val, e) => {
    inputs_data.obj[family][i].val = val;
});

const set_theme_prop = (key, new_val) => {
    const val = shared.mut.manifest[key];
    const val_is_localized = shared.val_is_localized(val);

    if (val_is_localized) {
        const message_key = shared.get_message_key(val);
        const locale_obj = shared.find_from_name(inputs_data.obj.theme_metadata, 'locale');
        const messages_path = shared.ob.chosen_folder_path + '/_locales/' + locale_obj.val + '/messages.json';
        const messages = JSON.parse(readFileSync(messages_path, 'utf-8').trim());

        messages[message_key].message = new_val;

        const new_messages = JSON.stringify(messages);

        writeFileSync(messages_path, new_messages, 'utf8');
    }
};