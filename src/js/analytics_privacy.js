'use_strict';

import { action, configure } from 'mobx';
import Store from 'electron-store';

import x from 'x';
import { inputs_data } from 'js/inputs_data';
import * as shared from 'js/shared';
import * as analytics from 'js/analytics';
import * as toggle_popup from 'js/toggle_popup';

configure({ enforceActions: 'observed' });
const store = new Store();

export const center_analytics_privacy = async () => {
    try {
        await x.delay(0); // without this offsetHeight will be incorrect

        const analytics_privacy = s('.analytics_privacy');

        analytics_privacy.style.marginTop = `-${analytics_privacy.offsetHeight / 2}px`;
        analytics_privacy.style.marginLeft = `-${analytics_privacy.offsetWidth / 2}px`;

    } catch (er) {
        err(er, 173);
    }
};

export const allow_or_disallow_analytics = action((enable_analytics, name) => {
    try {
        const enable_analytics_obj = shared.find_from_name(inputs_data.obj.options, 'enable_analytics');
        toggle_popup.ob.analytics_privacy_is_visible = false;
        enable_analytics_obj.val = enable_analytics;

        store.set('answered_to_analytics_privacy_question', true);
        store.set('enable_analytics', enable_analytics);

        analytics.send_event('btns', `clicked-analytics_privacy-${name}`);

    } catch (er) {
        err(er, 174);
    }
});
