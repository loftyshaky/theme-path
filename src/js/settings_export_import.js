import { readFileSync } from 'fs-extra';

import Store from 'electron-store';

import * as analytics from 'js/analytics';
import * as json_file from 'js/json_file';

const { dialog, getCurrentWindow } = require('electron').remote;

const store = new Store();

export const export_settings = () => {
    try {
        const save_path = dialog.showSaveDialog({
            defaultPath: 'ThemePath settings.json',
            filters: con.filters,
        });

        analytics.add_options_btns_analytics('tried_to_export');

        if (save_path) {
            json_file.write_to_json(store.get(), save_path);

            analytics.add_options_btns_analytics('exported');

        } else {
            analytics.add_options_btns_analytics('canceled_export');
        }

    } catch (er) {
        err(er, 190);
    }
};

export const import_settings = () => {
    try {
        const file_path = dialog.showOpenDialog({
            defaultPath: 'ThemePath settings.json',
            filters: con.filters,
        });

        analytics.add_options_btns_analytics('tried_to_import');

        if (file_path) {
            const file_content = readFileSync(file_path[0]);
            const settings_obj = JSON.parse(file_content);

            store.clear();
            store.set(settings_obj);

            getCurrentWindow().reload();

            analytics.add_options_btns_analytics('imported');

        } else {
            analytics.add_options_btns_analytics('canceled_import');
        }

    } catch (er) {
        err(er, 191, 'settings_file_is_corrupted');
    }
};

const con = {
    filters: [{ name: 'json', extensions: ['json'] }],
};
