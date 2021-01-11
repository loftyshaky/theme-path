import { action, configure } from 'mobx';

import x from 'x';
import { inputs_data } from 'js/inputs_data';
import * as change_val from 'js/change_val';
import * as history from 'js/history';
import * as manifest from 'js/manifest';
import * as els_state from 'js/els_state';
import * as analytics from 'js/analytics';

configure({ enforceActions: 'observed' });

export const con = {
    types: {
        h: 0,
        s: 1,
        l: 2,
    },
    types_reverse: {
        0: 'h',
        1: 's',
        2: 'l',
    },
    default_val: ['', '', ''],
    disabled_val: [-1, -1, -1],
};

export const change_sub_val = action((family, name, new_sub_val, type_i) => {
    try {
        if (/^[\d-.]+$/.test(new_sub_val) || new_sub_val === '') {
            manifest.reload_manifest();
            add_tints_obj();

            const new_sub_val_number = +new_sub_val;
            const sub_val_is_in_accepted_range = (new_sub_val_number >= 0 && new_sub_val_number <= 1) || new_sub_val_number === -1;
            const is_positive_or_negative_value_with_or_without_one_dot = /^-?\d*\.?\d+$/.test(new_sub_val);
            // eslint-disable-next-line eqeqeq
            const previous_full_val = manifest.mut.manifest.theme[family][name]
                ? manifest.mut.manifest.theme[family][name].slice()
                : undefined;

            if (sub_val_is_in_accepted_range) {
                normalize_other_sub_vals(family, name);
            }

            const full_val = inputs_data.obj[family][name].val.slice();

            inputs_data.obj[family][name].val[type_i] = new_sub_val;

            if (sub_val_is_in_accepted_range && is_positive_or_negative_value_with_or_without_one_dot) {
                els_state.set_applying_textarea_val_val(true);

                full_val[type_i] = new_sub_val_number;

                set_val(family, name, previous_full_val, full_val, type_i);
            }
        }

    } catch (er) {
        err(er, 326);
    }
});

const set_val = x.debounce((family, name, previous_val, new_val, type_i) => {
    try {
        const was_default = previous_val === undefined;
        const was_disabled = was_default
            ? false
            : previous_val.every(sub_val => sub_val === -1);
        const previous_val_final = was_default || was_disabled
            ? null
            : previous_val;

        change_val.change_val(family, name, new_val, null, false, true);

        history.record_change(() => history.generate_color_history_obj(family, name, was_default, was_disabled, previous_val_final, null, new_val, null, null, false, false, null));

        els_state.set_applying_textarea_val_val(false);

        analytics.send_event('number', `input-${family}-${name}-${con.types_reverse[type_i]}`);

    } catch (er) {
        err(er, 327);
    }
}, 1000);

export const change_val_by_mouse_wheel = action((e, family, name, type_i) => {
    try {
        manifest.reload_manifest();
        add_tints_obj();

        const previous_full_val = manifest.mut.manifest.theme[family][name]
            ? manifest.mut.manifest.theme[family][name].slice()
            : undefined;
        const sub_val = inputs_data.obj[family][name].val[type_i];
        let new_sub_val = +sub_val;
        const sub_val_includes_dot = new_sub_val.toString().includes('.');
        let changed_val = false;

        if (e.key === 'ArrowUp') { // up
            e.preventDefault();

            changed_val = true;

            if (sub_val_includes_dot) {
                new_sub_val += 0.01;

                new_sub_val = new_sub_val.toFixed(2);
            } else if (new_sub_val === 0) {
                new_sub_val = 0.01;
            } else {
                new_sub_val += 1;
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();

            changed_val = true;

            if (sub_val_includes_dot) {
                new_sub_val -= 0.01;

                new_sub_val = new_sub_val.toFixed(2);
            } else if (new_sub_val === 1) {
                new_sub_val = 0.99;

            } else if (new_sub_val !== 0) {
                new_sub_val -= 1;
            }
        }

        if (changed_val) {
            const sub_val_is_in_accepted_range = (new_sub_val >= 0 && new_sub_val <= 1) || new_sub_val === -1;
            if (+new_sub_val === 0 || +new_sub_val === 1) {
                new_sub_val = Math.round(new_sub_val);
            }

            if (sub_val_is_in_accepted_range) {
                els_state.set_applying_textarea_val_val(true);

                inputs_data.obj[family][name].val[type_i] = new_sub_val;

                normalize_other_sub_vals(family, name);

                set_val(family, name, previous_full_val, inputs_data.obj[family][name].val, type_i);
            }
        }

    } catch (er) {
        err(er, 329);
    }
});

const normalize_other_sub_vals = (family, name) => {
    try {
        inputs_data.obj[family][name].val.forEach((sub_val, i) => {
            if (inputs_data.obj[family][name].val[i] === '') {
                if (i === 0) {
                    inputs_data.obj[family][name].val[i] = -1;
                } else {
                    inputs_data.obj[family][name].val[i] = 0.5;
                }
            }

            inputs_data.obj[family][name].val[i] = +inputs_data.obj[family][name].val[i];
        });
    } catch (er) {
        err(er, 330);
    }
};

const add_tints_obj = () => {
    try {
        if (!manifest.mut.manifest.theme) {
            manifest.mut.manifest.theme = {};
        }

        if (!manifest.mut.manifest.theme.tints) {
            manifest.mut.manifest.theme.tints = {};
        }
    } catch (er) {
        err(er, 331);
    }
};
