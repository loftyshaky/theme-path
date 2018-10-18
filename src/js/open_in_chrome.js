'use_strict';

import x from 'x';
import * as shared from 'js/shared';
const kill = require('tree-kill');
const { readdirSync } = require('fs');
const { exec } = require('child_process');
const Store = require('electron-store');

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

//> variables
const mut = {
    chrome_process_ids: {}
}
//< variables