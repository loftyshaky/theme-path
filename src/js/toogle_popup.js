'use_strict';

import { observable, action, configure } from "mobx";
import * as r from 'ramda';

configure({ enforceActions: 'observed' });

export const toggle_popup = name => {
    const new_val = !ob.popup_visibility[name];

    close_all_popups();
    set_popup_visibility_bool(name, new_val);
};

export const set_popup_visibility_bool = action((name, bool) => {
    ob.popup_visibility[name] = bool;
});

export const close_all_popups = action(() => {
    ob.popup_visibility = r.map(() => false, ob.popup_visibility);

});

//> variables
export const ob = observable({
    popup_visibility: {
        settings: false,
        help: false,
        links: false
    },
    get proptecting_screen_is_visible() {
        return r.values(ob.popup_visibility).some(val => val);
    }
});
//< variables