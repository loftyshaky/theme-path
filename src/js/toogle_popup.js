'use_strict';

import { observable, action, configure } from "mobx";
import * as r from 'ramda';

configure({ enforceActions: 'observed' });

export const toggle_popup = action(name => {
    const new_val = !ob.popup_visibility[name];

    close_all_popups();

    ob.popup_visibility[name] = new_val;
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