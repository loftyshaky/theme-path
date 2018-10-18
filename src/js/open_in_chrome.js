'use_strict';

import x from 'x';
import * as shared from 'js/shared';
import { observable, action, configure } from "mobx";

const kill = require('tree-kill');
const { readdirSync } = require('fs');
const { exec } = require('child_process');
const Store = require('electron-store');

configure({ enforceActions: 'observed' });

const store = new Store();

export const open_in_chrome = async path => {
    if (shared.ob.chosen_folder_path != '') {
        const files = readdirSync(shared.ob.chosen_folder_path);
        const folder_is_theme = files.find(file => file == 'manifest.json');

        if (folder_is_theme) {
            kill(mut.chrome_process_ids[path]);

            const child_process = await exec('chrome.exe --start-maximized --user-data-dir="' + path + '" --load-extension="' + shared.ob.chosen_folder_path + '"', { cwd: store.get('chrome_dir') });

            mut.chrome_process_ids[path] = child_process.pid;

        } else {
            x.error(4, 'chosen_folder_is_not_theme_alert');
        }

    } else {
        x.error(3, 'theme_folder_is_not_chosen_alert');
    }
};

export const update_chrome_user_data_dirs_observable = action(() => {
    ob.chrome_user_data_dirs = store.get('chrome_user_data_dirs');
});

//> variables
const mut = {
    chrome_process_ids: {}
};

export const ob = observable({
    chrome_user_data_dirs: null
});
//< variables