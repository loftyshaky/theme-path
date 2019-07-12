'use_strict';

import { action, configure } from 'mobx';
import Store from 'electron-store';

import { inputs_data } from 'js/inputs_data';
import * as analytics from 'js/analytics';
import * as toggle_popup from 'js/toggle_popup';

configure({ enforceActions: 'observed' });
const store = new Store();

export const allow_or_disallow_analytics = action((enable_analytics, name) => {
    try {
        const enable_analytics_obj = inputs_data.obj.options.enable_analytics;
        toggle_popup.ob.analytics_privacy_is_visible = false;
        enable_analytics_obj.val = enable_analytics;

        store.set('answered_to_analytics_privacy_question', true);
        store.set('enable_analytics', enable_analytics);

        analytics.send_event('btns', `clicked-analytics_privacy-${name}`);
        analytics.track_app_start();

    } catch (er) {
        err(er, 174);
    }
});
