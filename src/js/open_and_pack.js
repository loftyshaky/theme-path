'use_strict';

import { join, sep } from 'path';
import { existsSync, unlinkSync, readdirSync } from 'fs-extra';
import { exec } from 'child_process';
import glob from 'glob';

import kill from 'tree-kill';
import zipLocal from 'zip-local';
import Store from 'electron-store';

import * as shared from 'js/shared';
import { observable, action, configure } from 'mobx';

configure({ enforceActions: 'observed' });
const store = new Store();

//--

const run = callback => {
    try {
        if (shared.ob.chosen_folder_path !== store.get('work_folder')) {
            const files = readdirSync(shared.ob.chosen_folder_path);
            const folder_is_theme = files.find(file => file === 'manifest.json');

            if (folder_is_theme) {
                callback();

            } else {
                err(er_obj('Chosen folder is not a theme'), 4, 'chosen_folder_is_not_theme');
            }

        } else {
            err(er_obj('Theme folder is not chosen'), 3, 'theme_folder_is_not_chosen');
        }

    } catch (er) {
        err(er, 16);
    }
};

export const open_in_chrome = folder_path => {
    run(() => {
        kill(mut.chrome_process_ids[folder_path], 'SIGKILL', async er => {
            if (er) {
                err(er, 15, null, true);
            }

            try {
                const child_process = await exec(`chrome.exe chrome-search://local-ntp/local-ntp.html chrome-search://local-ntp/local-ntp.html chrome-search://local-ntp/local-ntp.html --start-maximized --user-data-dir="${folder_path}" --load-extension="${shared.ob.chosen_folder_path}"`, { cwd: store.get('chrome_dir') }); // eslint-disable-line max-len

                mut.chrome_process_ids[folder_path] = child_process.pid;

            } catch (er2) {
                err(er2, 46);
            }
        });
    });
};

export const update_chrome_user_data_dirs_observable = action(() => {
    try {
        ob.chrome_user_data_dirs = store.get('chrome_user_data_dirs');

    } catch (er) {
        err(er, 47);
    }
});

export const pack = type => {
    run(async () => {
        try {
            const directory_to_save_package_in = shared.ob.chosen_folder_path.substring(
                0,
                shared.ob.chosen_folder_path.lastIndexOf(sep),
            );
            const package_name = shared.ob.chosen_folder_path.substring(
                shared.ob.chosen_folder_path.lastIndexOf(sep) + 1,
            );
            const pak_path = join(shared.ob.chosen_folder_path, 'Cached Theme.pak');

            try {
                if (existsSync(pak_path)) {
                    unlinkSync(pak_path);
                }

            } catch (er) {
                err(er, 6, 'pak_is_locked');
            }

            if (type === 'zip') {
                const zip_path = join(directory_to_save_package_in, `${package_name}.zip`);

                try {
                    if (existsSync(zip_path)) {
                        unlinkSync(zip_path);
                    }

                } catch (er) {
                    err(er, 18, 'zip_is_locked');
                }


                zipLocal.zip(shared.ob.chosen_folder_path, (er, zip) => {
                    if (!er) {
                        zip.compress().save(zip_path);

                    } else {
                        err(er, 5);
                    }
                });

            } if (type === 'crx') {
                const crx_path = join(directory_to_save_package_in, `${package_name}.crx`);

                try {
                    if (existsSync(crx_path)) {
                        unlinkSync(crx_path);
                    }

                } catch (er) {
                    err(er, 19, 'crx_is_locked');
                }

                //> remove pems
                const pem_files = glob.sync(`${directory_to_save_package_in + sep}*.pem`);

                pem_files.forEach(pem_file => {
                    try {
                        if (existsSync(pem_file)) {
                            unlinkSync(pem_file);
                        }

                    } catch (er) {
                        err(er, 7, 'pem_is_locked');
                    }
                });
                //< remove pems

                exec(`chrome.exe --pack-extension="${shared.ob.chosen_folder_path}"`, { cwd: store.get('chrome_dir') });
            }

        } catch (er) {
            err(er, 17);
        }
    });
};

//> variables
const mut = {
    chrome_process_ids: {},
};

export const ob = observable({
    chrome_user_data_dirs: null,
});
//< variables
