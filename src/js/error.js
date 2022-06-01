import { observable, action } from 'mobx';

import x from 'x';
import * as analytics from 'js/analytics';

export const ob = observable({
    component_has_er: false,
    er_is_visible: false,
    er_is_highlighted: false,
    er_is_persistent: false,
    er_msg: '',
    er_msg_more_info: '',
    more_info_is_visible: false,
});

const mut = {
    er_is_visible_timeout: null,
    er_is_highlighted_timeout: null,
};

export const change_er_state = action((name, bool) => {
    ob[name] = bool;
});

const run_timeout = (name, delay) => {
    mut[`${name}_timeout`] = window.setTimeout(() => {
        change_er_state(name, false);
    }, delay);
};

export const clear_all_timeouts = () => {
    clearTimeout(mut.er_is_visible_timeout);
    clearTimeout(mut.er_is_highlighted_timeout);
};

export const set_component_has_er = action((bool) => {
    ob.component_has_er = bool;
});

const change_er_persistence = action((persistent) => {
    ob.er_is_persistent = persistent || false;
});

export const show_or_hide_er_more_info = action((bool) => {
    ob.more_info_is_visible = bool;
});

window.err = action((er_obj, er_code, er_msg_param, silent, persistent, exit) => {
    if (!er_obj.silent && !silent) {
        const er_msg = x.msg(`${er_obj.msg || er_msg_param}_er`);
        const er_msg_final = er_msg ? ` ${er_msg}` : '';

        show_or_hide_er_more_info(false);
        ob.er_msg = `${x.msg('an_error_occured_msg') + er_msg_final}`;
        ob.er_msg_more_info = `${x.msg('error_code_label') + (er_obj.er_code || er_code)}\n${
            x.msg('error_type_label') + er_obj.name
        }\n${x.msg('error_msg_label') + er_obj.message}`;

        change_er_state('er_is_visible', true);
        change_er_state('er_is_highlighted', true);

        change_er_persistence(persistent);
        clear_all_timeouts();

        if (!er_obj.persistent && !persistent) {
            run_timeout('er_is_visible', 5200);
        }

        run_timeout('er_is_highlighted', 200);
    }

    if (er_obj.exit || exit) {
        const updated_er_obj = er_obj;
        updated_er_obj.er_code = er_obj.er_code || er_code;
        updated_er_obj.msg = er_obj.msg || er_msg_param;
        updated_er_obj.silent = er_obj.silent || silent;
        updated_er_obj.persistent = er_obj.persistent || persistent;
        updated_er_obj.exit = er_obj.exit || exit;

        throw updated_er_obj;
    } else {
        const er_code_and_msg = `Error code: ${er_code}\nMessage: ${er_obj.message}`;
        const console_output = er_obj.stack
            ? `${er_obj.stack}\n${er_code_and_msg}`
            : er_code_and_msg;

        console.error(console_output); // eslint-disable-line no-console
    }

    analytics.send_event('error', er_code);
});

window.t = (msg) => {
    throw new Error(msg);
};

window.er_obj = (msg) => new Error(msg);
