'use_strict';

import x from 'x';
import * as shared from 'js/shared';
import { observable, action, configure } from 'mobx';

const kill = require('tree-kill');
const zipLocal = require('zip-local');
const { join, sep } = require('path');
const { existsSync, unlinkSync, readdirSync } = require('fs');
const { exec } = require('child_process');
const glob = require('glob');
const Store = require('electron-store');

configure({ enforceActions: 'observed' });

const store = new Store();

const run = callback => {
    if (shared.ob.chosen_folder_path != '') {
        const files = readdirSync(shared.ob.chosen_folder_path);
        const folder_is_theme = files.find(file => file == 'manifest.json');

        if (folder_is_theme) {
            callback();

        } else {
            x.error(4, 'chosen_folder_is_not_theme_alert');
        }

    } else {
        x.error(3, 'theme_folder_is_not_chosen_alert');
    }
};

export const open_in_chrome = folder_path => {
    run(() => {
        kill(mut.chrome_process_ids[folder_path], 'SIGKILL', async er => {
            const child_process = await exec('chrome.exe --start-maximized --user-data-dir="' + folder_path + '" --load-extension="' + shared.ob.chosen_folder_path + '"', { cwd: store.get('chrome_dir') });

            mut.chrome_process_ids[folder_path] = child_process.pid;
        });
    });
};

export const update_chrome_user_data_dirs_observable = action(() => {
    ob.chrome_user_data_dirs = store.get('chrome_user_data_dirs');
});

export const pack = type => {
    run(async () => {
        const directory_to_save_package_in = shared.ob.chosen_folder_path.substring(0, shared.ob.chosen_folder_path.lastIndexOf(sep));
        const package_name = shared.ob.chosen_folder_path.substring(shared.ob.chosen_folder_path.lastIndexOf(sep) + 1);
        const pak_path = join(shared.ob.chosen_folder_path, 'Cached Theme.pak');

        try {
            if (existsSync(pak_path)) {
                unlinkSync(pak_path);
            }

        } catch (er) {
            x.error(6, 'file_is_locked_alert');
            throw er;
        }

        if (type == 'zip') {
            zipLocal.zip(shared.ob.chosen_folder_path, (er, zip) => {
                if (!er) {
                    zip.compress().save(join(directory_to_save_package_in, package_name + '.zip'));

                } else {
                    x.error(5);
                }
            });

        } if (type == 'crx') {
            //> remove pems
            const pem_files = glob.sync(directory_to_save_package_in + sep + '*.pem');

            for (const pem_file of pem_files) {
                try {
                    if (existsSync(pem_file)) {
                        unlinkSync(pem_file);
                    }

                } catch (er) {
                    x.error(7, 'file_is_locked_alert');
                    throw er;
                }
            }
            //< remove pems

            exec('chrome.exe --pack-extension="' + shared.ob.chosen_folder_path + '"', { cwd: store.get('chrome_dir') });
        }
    });
};

//> variables
const mut = {
    chrome_process_ids: {}
};

export const ob = observable({
    chrome_user_data_dirs: null
});
//< variables