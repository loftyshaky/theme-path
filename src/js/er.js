import { observable, action, configure } from 'mobx';

import x from 'x';

configure({ enforceActions: 'observed' });

window.er = action((er_obj, er_code, silent, persistent) => {
    if (!silent) {
        const er_code_msg = x.message(`er_msg_${er_code}`);
        const er_code_msg_final = er_code_msg ? ` ${er_code_msg}` : '';

        ob.er_msg = `${x.message('an_error_occured_msg') + er_code_msg_final}\n${x.message('error_code_label') + er_code}\n${x.message('error_type_label') + er_obj.name}\n${x.message('error_msg_label') + er_obj.message}`; // eslint-disable-line max-len

        change_er_state('er_is_visible', true);
        change_er_state('er_is_highlighted', true);

        change_er_persistence(persistent);
        clear_all_timeouts();

        if (!persistent) {
            run_timeout('er_is_visible', 10000);
        }

        run_timeout('er_is_highlighted', 200);
    }
    //l(er_obj.name, er_obj.message, er_obj.constructor)
    throw new Error(er_obj.stack);
});

window.t = msg => {
    throw new Error(msg);
};

const run_timeout = (name, delay) => {
    mut[`${name}_timeout`] = window.setTimeout(() => {
        change_er_state(name, false);
    }, delay);
};

export const clear_all_timeouts = () => {
    clearTimeout(mut.er_is_visible_timeout);
    clearTimeout(mut.er_is_highlighted_timeout);
};

export const change_er_state = action((name, bool) => {
    ob[name] = bool;
});

const change_er_persistence = action(persistent => {
    ob.er_is_persistent = persistent || false;
});

//> variables
export const ob = observable({
    er_is_visible: false,
    er_is_highlighted: false,
    er_is_persistent: false,
    er_msg: '',
});

const mut = {
    er_is_visible_timeout: null,
    er_is_highlighted_timeout: null,
};
//< variables
