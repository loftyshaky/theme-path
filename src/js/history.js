'use_strict';

import { join } from 'path';
import { existsSync } from 'fs';

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
import * as folders from 'js/work_folder/folders';

configure({ enforceActions: 'observed' });
const store = new Store();

export const load_history = () => {
    try {
        folders.check_if_selected_folder_is_theme(() => {
            try {
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
    try {
        manifest.reload_manifest();

        const number_of_changes = mut.changes_to_revert.length;
        const clicked_on_last_item = number_of_changes === 0;

        if (!clicked_on_last_item) {
            for (const change of mut.changes_to_revert) {
                const { family, name, from, from_manifest_val, was_default, was_disabled } = change;

                if (family === 'colors' || family === 'tints') {
                    if (!was_default) {
                        if (!was_disabled) {
                            manifest.mut.manifest.theme[family][name] = from_manifest_val;

                        } else {
                            manifest.mut.manifest.theme[family][name] = set_default_or_disabled.con.disabled_manifest_val;
                        }

                    } else {
                        set_default_or_disabled.delete_key_from_manifest(family, name);
                    }

                } else if (selects_cond(family, name)) {
                    if (!was_default) {
                        change_val.change_val(family, name, from, null);

                    } else {
                        set_default_or_disabled.set_default_or_disabled(family, name, 'select');
                    }
                }
            }

            const history_arr = toJS(r.dropLast(number_of_changes, ob.history));

            json_file.write_to_json(history_arr, get_history_path());
            json_file.write_to_manifest_json();
        }

        change_revert_position(Infinity);
        show_or_hide_history(false);

        analytics.add_history_analytics('history_accept');

    } catch (er) {
        err(er, 205);
    }
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

export const generate_color_history_obj = (family, name, was_default, was_disabled, from_hex, from_manifest_val, to_hex, set_to_default, set_to_disabled) => {
    try {
        return {
            family,
            name,
            was_default,
            was_disabled,
            from_hex,
            from_manifest_val,
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
            from,
            to,
            set_to_default,
            timestamp: get_timestamp(),
        };

    } catch (er) {
        err(er, 222);
    }

    return undefined;
};

export const record_change = generate_history_obj_f => {
    try {
        const history_arr = get_history_arr();
        const history_path = get_history_path();

        const history_obj = generate_history_obj_f();

        history_arr.push(history_obj);
        json_file.create_json_file(history_path, '[]');
        json_file.write_to_json(history_arr, history_path);

    } catch (er) {
        err(er, 223);
    }
};

const get_timestamp = () => new Date().getTime();

const get_history_arr = () => {
    try {
        const history_path = get_history_path();

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

const get_history_path = () => join(chosen_folder_path.ob.chosen_folder_path, con.history_path);

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
                const { family, name, from, from_hex, was_default, was_disabled } = change;

                if (family === 'colors' || family === 'tints') {
                    color_pickiers.set_color_input_vizualization_color(family, name, from_hex, false);

                    change_val.set_default_bool(family, name, was_default);

                    if (family === 'tints') {
                        change_val.set_disabled_bool(family, name, was_disabled);
                    }

                } else if (selects_cond(family, name)) {
                    change_val.set_inputs_data_val(family, name, from);
                }
            }
        }

        analytics.add_history_analytics('history_item');

    } catch (er) {
        err(er, 209);
    }
};

const show_or_hide_history = action(bool => {
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

export const set_history_popup_width = () => {
    try {
        s('.history_popup').style.width = `${store.get('history_popup_width')}px`;

    } catch (er) {
        err(er, 213);
    }
};

export const reset_history_popup_content = action(() => {
    try {
        ob.reset_history_popup_content = Date.now();

    } catch (er) {
        err(er, 216);
    }
});

export const selects_cond = (family, name) => family === 'properties' || (family === 'clear_new_tab' && name !== 'clear_new_tab_video') || (family === 'theme_metadata' && (name === 'locale' || name === 'default_locale'));

const con = {
    history_path: 'system/history.json',
    months: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].map(month => x.msg(month)),
};

const mut = {
    changes_to_revert: null,
    initial_inputs_data: null,
};

export const ob = observable({
    history: [],
    history_is_visible: false,
    revert_position: Infinity,
    reset_history_popup_content: null,
});
