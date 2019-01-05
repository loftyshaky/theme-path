'use_strict';

import { observable, action, configure } from 'mobx';
import * as r from 'ramda';
import Store from 'electron-store';

import * as analytics from 'js/analytics';

configure({ enforceActions: 'observed' });
const store = new Store();

//--

export const toggle_popup = name => {
    try {
        const new_val = !ob.popup_visibility[name];

        close_all_popups(false);
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

export const close_all_popups = action((closing_by_clicking_on_protecting_screen_or_hitting_esc, analytics_action) => {
    try {
        let opened_popup_name;

        if (closing_by_clicking_on_protecting_screen_or_hitting_esc) {
            opened_popup_name = r.keys(ob.popup_visibility).find(key => {
                if (ob.popup_visibility[key] === true) {
                    return key;
                }

                return undefined;
            });
        }

        ob.popup_visibility = r.map(() => false, ob.popup_visibility);

        if (closing_by_clicking_on_protecting_screen_or_hitting_esc) {
            analytics.send_event('protecting_screens', `${analytics_action}-${opened_popup_name}`);
        }

    } catch (er) {
        err(er, 69);
    }
});

export const close_all_popups_by_keyboard = e => {
    const esc_pressed = e.keyCode === 27;

    if (esc_pressed) {
        close_all_popups(true, 'hit_esc');
    }
};

//> variables
export const ob = observable({
    popup_visibility: {
        settings: false,
        links: false,
    },
    analytics_privacy_is_visible: !store.get('answered_to_analytics_privacy_question'),
    get proptecting_screen_is_visible() {
        return r.values(ob.popup_visibility).some(val => val);
    },
});
//< variables
