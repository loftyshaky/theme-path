import Store from 'electron-store';

import x from 'x';
import * as history from 'js/history';

const store = new Store();

export const observer = new window.MutationObserver(mutations => {
    try {
        for (const mutation of mutations) {
            const { target } = mutation;

            if (x.matches(target, '.history_popup')) {
                history.reset_history_popup_content();
                set_history_popup_width(mutation);
            }
        }


    } catch (er) {
        err(er, 215);
    }
});

const set_history_popup_width = x.debounce(mutation => {
    try {
        const width_style = mutation.target.attributes['1'].nodeValue; // ex: width: 1122px;

        if (width_style) {
            const history_popup_width = +width_style.match(/\d+/)[0]; // ex: 1122 (type: number)

            store.set('history_popup_width', history_popup_width);
        }


    } catch (er) {
        err(er, 214);
    }
}, 1000);
