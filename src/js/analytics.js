import Store from 'electron-store';

import * as help_viewer from 'js/help_viewer';
import * as tutorial from 'js/tutorial';

const store = new Store();

export const send_pageview = async page => {
    try {
        check_if_analytics_enabled(() => send_request('pageview', page, null, null));

    } catch (er) {
        err(er, 194);
    }
};

export const send_event = (category, action) => {
    try {
        check_if_analytics_enabled(() => send_request('event', null, category, action));

    } catch (er) {
        err(er, 195);
    }
};

const check_if_analytics_enabled = callback => {
    try {
        const allow_analytics = store.get('enable_analytics');

        if (allow_analytics) {
            callback();
        }

    } catch (er) {
        err(er, 196);
    }
};

export const send_request = async (mode, page, category, action, callback) => {
    try {
        const tracking_id = con.dev ? 'UA-131099848-3' : 'UA-131099848-1';
        const client_id_try = await store.get('client_id');
        const client_id_is_valid = /[0-9]{10}\.[0-9]{10}/.test(client_id_try);

        if (!client_id_is_valid) {
            await store.set('client_id', con.generated_client_id);
        }

        const client_id = client_id_try || con.generated_client_id;
        const message = `v=1&tid=${tracking_id}&cid=${client_id}&aip=1&ds=app&t=${mode === 'pageview' ? `pageview&dp=${page}` : `event&ec=${category}&ea=${action}`}`;

        await window.fetch('https://www.google-analytics.com/collect', {
            method: 'POST',
            body: message,
        });

        if (callback) {
            callback();
        }

    } catch (er) {
        err(er, 197, null, true);
    }
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

export const add_popup_close_btns_analytics = name => {
    send_event('popup_close_btns', `clicked-${name}`);
};

export const add_history_analytics = name => {
    send_event('history', `clicked-${name}`);
};

export const track_app_start = () => {
    send_pageview('main');
    send_event('app_version', app_version);
    send_event('app_host', process.windowsStore ? 'microsoft_store' : 'package');
};

const con = {
    dev: !!(process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)),
    generated_client_id: `${Math.floor(Math.random() * (2147483647 - 1000000000 + 1)) + 1000000000}.${Math.floor(new Date().getTime() / 1000)}`, // eqwuavelent of php rand(1000000000, 2147483647) . '.' . time();
};
