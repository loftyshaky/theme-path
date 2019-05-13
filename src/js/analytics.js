import Store from 'electron-store';
import ua from 'universal-analytics';

import * as help_viewer from 'js/help_viewer';
import * as tutorial from 'js/tutorial';

const store = new Store();

const visitor = ua('UA-131099848-1');

visitor.set('anonymizeIp', true);

export const send_pageview = async page => {
    try {
        check_if_analytics_enabled(() => visitor.pageview(page).send());

    } catch (er) {
        err(er, 153);
    }
};

export const send_event = (category, action) => {
    try {
        check_if_analytics_enabled(() => visitor.event(category, action).send());

    } catch (er) {
        err(er, 161);
    }
};

export const send_event_async = (category, action, callback, callback_args) => {
    try {
        const analytics_enabled = check_if_analytics_enabled();

        if (analytics_enabled) {
            visitor.event(category, action, () => {
                callback(...callback_args);
            });

        } else {
            callback(...callback_args);
        }

    } catch (er) {
        err(er, 171);
    }
};

export const check_if_analytics_enabled = callback => {
    try {
        const analytics_enabled = typeof store.get('enable_analytics') === 'undefined' ? false : store.get('enable_analytics');
        const enable_analytics_dev = typeof store.get('enable_analytics_dev') === 'undefined' ? false : store.get('enable_analytics_dev');
        const analytics_enabled_final = (!sta.dev && analytics_enabled) || enable_analytics_dev;

        if (analytics_enabled_final) {
            if (callback) {
                callback();
            }

            return true;
        }

        return false;

    } catch (er) {
        err(er, 160);
    }

    return undefined;
};

export const add_header_btns_analytics = name => {
    send_event('header_items', `clicked-${name}`);
};

export const add_work_folder_analytics = action => {
    send_event('work_folder', `${action}`);
};

export const add_help_viewer_analytics = action => {
    send_event('help_viewer', `${action}-${help_viewer.mut.current_family}-${help_viewer.mut.current_name}`);
};

export const add_tutorial_analytics = action => {
    send_event('tutorial', `${action}_at_stage_${tutorial.ob.tutorial_stage}`);
};

export const add_settings_export_import_analytics = action => {
    send_event('settings_export_import', `${action}`);
};


export const track_app_start = () => {
    send_pageview('main');
    send_event('app_version', app_version);
    send_event('app_host', process.windowsStore ? 'microsoft_store' : 'package');
};

export const sta = {
    dev: !!(process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)),
    visitor,
};
