'use_strict';

import { observable, action, configure } from 'mobx';
import * as r from 'ramda';

configure({ enforceActions: 'observed' });

//--

export const toggle_popup = name => {
    try {
        const new_val = !ob.popup_visibility[name];

        close_all_popups();
        set_popup_visibility_bool(name, new_val);

    } catch (er) {
        err(er, 67);
    }
};

export const set_popup_visibility_bool = action((name, bool) => {
    try {
        ob.popup_visibility[name] = bool;

    } catch (er) {
        err(er, 68);
    }
});

export const close_all_popups = action(() => {
    try {
        ob.popup_visibility = r.map(() => false, ob.popup_visibility);

    } catch (er) {
        err(er, 69);
    }
});

export const close_all_popups_by_keyboard = e => {
    const esc_pressed = e.keyCode === 27;

    if (esc_pressed) {
        close_all_popups();
    }
};

//> variables
export const ob = observable({
    popup_visibility: {
        settings: false,
        help: false,
        links: false,
    },
    get proptecting_screen_is_visible() {
        return r.values(ob.popup_visibility).some(val => val);
    },
});
//< variables
