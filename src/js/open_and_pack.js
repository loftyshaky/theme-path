'use_strict';

import { join, sep } from 'path';
import { homedir, platform } from 'os';
import { existsSync, unlinkSync, readdirSync, moveSync } from 'fs-extra';
import { execFile, execFileSync } from 'child_process';
import glob from 'glob';

import kill from 'tree-kill';
import zipLocal from 'zip-local';
import Store from 'electron-store';
import getChrome from 'get-chrome';

import * as chosen_folder_path from 'js/chosen_folder_path';
import * as tutorial from 'js/tutorial';
import * as analytics from 'js/analytics';
import * as folders from 'js/work_folder/folders';
import { observable, action, configure } from 'mobx';

import * as choose_folder from 'js/work_folder/choose_folder';

configure({ enforceActions: 'observed' });
const store = new Store();

const run = callback => {
    try {
        if (choose_folder.reset_work_folder(false)) {
            if (folders.mut.chosen_folder_info.is_theme) {
                const files = readdirSync(chosen_folder_path.ob.chosen_folder_path);
                const folder_is_theme = files.find(file => file === 'manifest.json');

                if (folder_is_theme) {
                    callback();

                } else {
                    err(er_obj('Chosen folder is not a theme'), 4, 'chosen_folder_is_not_theme');
                }

            } else {
                err(er_obj('Theme folder is not chosen'), 3, 'theme_folder_is_not_chosen');
            }
        }

    } catch (er) {
        err(er, 16);
    }
};

export const open_in_chrome = (folder_path, default_exe_path, e) => {
    try {
        if ((e.type === 'mouseup' && (e.button === 0 || e.button === 2)) || (e.type === 'keyup' && e.keyCode === 13)) {
            const left_button_clicked = e.button === 0 || (e.type === 'keyup' && !e.ctrlKey && !e.shiftKey);
            const new_tab_url = 'chrome-search://local-ntp/local-ntp.html';
            const chrome_path = default_exe_path ? getChrome(platform()) : store.get('chrome_exe_path').trim();
            const user_data_path = folder_path.trim() || join(homedir(), 'Chrome Theme Creator Chrome Preview Directory');
            const incognito = !left_button_clicked ? ' --incognito' : '--x';

            run(() => {
                kill(mut.chrome_process_ids[user_data_path], 'SIGKILL', async er => {
                    if (er) {
                        err(er, 15, null, true);
                    }

                    try {
                        const name = folder_path === '' ? 'open_in_chrome' : 'open_in_profiled_chrome';
                        const click_type = left_button_clicked ? 'clicked' : 'right_clicked';
                        const child_process = await execFile(chrome_path,
                            [
                                new_tab_url,
                                new_tab_url,
                                new_tab_url,
                                incognito,
                                '--start-maximized',
                                '--no-first-run', // without this canary chrome will not start if Chrome Theme Creator Chrome Preview Directory doesn't exist
                                '--no-sandbox', // fix blank black screen in Chrome Canary
                                '--test-type', // "supress You are using an unsupported command-line flag: --no-sandbox. Stability and security will suffer." message
                                `--user-data-dir=${user_data_path}`,
                                `--load-extension=${chosen_folder_path.ob.chosen_folder_path}`,
                            ]);

                        mut.chrome_process_ids[user_data_path] = child_process.pid;

                        if (tutorial.ob.tutorial_stage === 6) {
                            tutorial.increment_tutorial_stage(false, true);
                        }


                        analytics.send_event('header_items', `${click_type}-${name}`);

                    } catch (er2) {
                        err(er2, 46);
                    }
                });
            });
        }
    } catch (er) {
        err(er, 145);
    }
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
            const directory_to_save_package_in = chosen_folder_path.ob.chosen_folder_path.substring(
                0,
                chosen_folder_path.ob.chosen_folder_path.lastIndexOf(sep),
            );
            const package_name = chosen_folder_path.ob.chosen_folder_path.substring(chosen_folder_path.ob.chosen_folder_path.lastIndexOf(sep) + 1);
            const pak_path = join(chosen_folder_path.ob.chosen_folder_path, 'Cached Theme.pak');
            const system_path = join(chosen_folder_path.ob.chosen_folder_path, 'system');
            const work_folder_system_path = join(choose_folder.ob.work_folder, 'system');

            moveSync(system_path, work_folder_system_path, { overwrite: true });

            try {
                if (existsSync(pak_path)) {
                    unlinkSync(pak_path);
                }

            } catch (er) {
                err(er, 6, 'pak_is_locked', false, false, true);
            }

            if (type === 'zip') {
                const zip_path = join(directory_to_save_package_in, `${package_name}.zip`);

                try {
                    if (existsSync(zip_path)) {
                        unlinkSync(zip_path);
                    }

                } catch (er) {
                    err(er, 18, 'zip_is_locked', false, false, true);
                }


                zipLocal.zip(chosen_folder_path.ob.chosen_folder_path, (er, zip) => {
                    if (!er) {
                        zip.compress().save(zip_path);

                        moveSync(work_folder_system_path, system_path, { overwrite: true });

                    } else {
                        err(er, 5, null, false, false, true);
                    }
                });

            } if (type === 'crx') {
                const crx_path = join(directory_to_save_package_in, `${package_name}.crx`);

                try {
                    if (existsSync(crx_path)) {
                        unlinkSync(crx_path);
                    }

                } catch (er) {
                    err(er, 19, 'crx_is_locked', false, false, true);
                }

                //> remove pems
                const pem_files = glob.sync(`${directory_to_save_package_in + sep}*.pem`);

                pem_files.forEach(pem_file => {
                    try {
                        if (existsSync(pem_file)) {
                            unlinkSync(pem_file);
                        }

                    } catch (er) {
                        err(er, 7, 'pem_is_locked', false, false, true);
                    }
                });
                //< remove pems

                execFileSync(getChrome(platform()), [`--pack-extension=${chosen_folder_path.ob.chosen_folder_path}`]);

                moveSync(work_folder_system_path, system_path, { overwrite: true });
            }

            if (tutorial.ob.tutorial_stage === 7) {
                tutorial.increment_tutorial_stage(true, true);
            }

        } catch (er) {
            err(er, 17);
        }
    });
};

const mut = {
    chrome_process_ids: {},
};

export const ob = observable({
    chrome_user_data_dirs: null,
});
