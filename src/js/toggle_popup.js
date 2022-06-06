import { observable, action } from 'mobx';
import * as r from 'ramda';

import * as history from 'js/history';

export const ob = observable({
    popup_visibility: {
        options: false,
        help: false,
    },

    get protecting_screen_is_visible() {
        return r.values(ob.popup_visibility).some((val) => val);
    },
});

export const close_all_popups = action(() => {
    try {
        ob.popup_visibility = r.map(() => false, ob.popup_visibility);
    } catch (er) {
        err(er, 69);
    }
});

export const set_popup_visibility_bool = action((name, bool) => {
    try {
        ob.popup_visibility[name] = bool;
    } catch (er) {
        err(er, 68);
    }
});

export const close_all_popups_by_keyboard = (e) => {
    const esc_pressed = e.keyCode === 27;

    if (esc_pressed) {
        close_all_popups();
        history.show_or_hide_history(false);
    }
};

export const toggle_popup = (name) => {
    try {
        const new_val = !ob.popup_visibility[name];

        close_all_popups();
        set_popup_visibility_bool(name, new_val);
    } catch (er) {
        err(er, 67);
    }
};
