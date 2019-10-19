import { join, sep } from 'path';
import { homedir, platform } from 'os';
import { existsSync, unlinkSync, moveSync } from 'fs-extra';
import { execFile, execFileSync } from 'child_process';
import glob from 'glob';
import { remote } from 'electron';

import { observable, action, configure } from 'mobx';
import psTree from 'ps-tree';
import zipLocal from 'zip-local';
import Store from 'electron-store';
import getChrome from 'get-chrome';

import * as chosen_folder_path from 'js/chosen_folder_path';
import * as tutorial from 'js/tutorial';
import * as analytics from 'js/analytics';
import * as confirm from 'js/confirm';
import * as processing_msg from 'js/processing_msg';
import * as folders from 'js/work_folder/folders';
import * as enter_click from 'js/enter_click';
import * as choose_folder from 'js/work_folder/choose_folder';

configure({ enforceActions: 'observed' });
const store = new Store();

export const open_in_chrome = (chrome_exe_path, folder_path, e) => {
    try {
        if ((e.type === 'mouseup' && (e.button === 0 || e.button === 2)) || (e.type === 'keyup' && e.keyCode === enter_click.sta.enter_key_code && (!e.ctrlKey || !e.shiftKey))) {
            const left_button_clicked = e.button === 0 || (e.type === 'keyup' && !e.ctrlKey && !e.shiftKey);
            const new_tab_url = 'chrome-search://local-ntp/local-ntp.html';
            const chrome_exe_path_final = chrome_exe_path || getChrome(platform());
            const user_data_path = folder_path || join(join(homedir(), 'chrome-theme-creator'), 'chrome-preview-user-data');
            const incognito = !left_button_clicked ? ' --incognito' : '--x';
            const chrome_process_ids = !left_button_clicked ? 'chrome_incognito_process_ids' : 'chrome_process_ids';
            const chrome_process_id = mut[chrome_process_ids][user_data_path];

            folders.check_if_selected_folder_is_theme(() => {
                psTree(chrome_process_id, async (er, children) => {
                    if (er) {
                        err(er, 15, null, true);
                    }

                    //> kill al chrome processes
                    try {
                        process.kill(chrome_process_id, 'SIGTERM');

                        for (const child of children) {
                            process.kill(child.PID, 'SIGTERM');
                        }

                    } catch (er2) {
                        err(er2, 292, null, true);
                    }
                    //< kill al chrome processes

                    try {
                        const name = chrome_exe_path ? 'open_in_profiled_chrome' : 'open_in_chrome';
                        const click_type = left_button_clicked ? 'clicked' : 'right_clicked';
                        const child_process = await execFile(chrome_exe_path_final,
                            [
                                new_tab_url,
                                new_tab_url,
                                new_tab_url,
                                incognito,
                                '--start-maximized',
                                '--no-first-run', // without this canary chrome will not start if Chrome Theme Creator Chrome Preview Directory doesn't exist
                                '--no-sandbox', // fix blank black screen in Chrome Canary
                                '--test-type', // "supress You are using an unsupported command-line flag: --no-sandbox. Stability and security will suffer." message
                                `--user-data-dir=${user_data_path}${!left_button_clicked ? '-incognito' : ''}`,
                                `--load-extension=${chosen_folder_path.ob.chosen_folder_path}`,
                            ]);

                        mut[chrome_process_ids][user_data_path] = child_process.pid;

                        if (tutorial.ob.tutorial_stage === 6) {
                            tutorial.increment_tutorial_stage(false, true);
                        }


                        analytics.send_event('header_items', `${click_type}-${name}`);

                    } catch (er2) {
                        err(er2, 46);
                    }
                });
            });

        } else if (e.button === 1 || (e.keyCode === enter_click.sta.enter_key_code && e.ctrlKey && e.shiftKey)) {
            e.type = 'mouseup';
            e.button = 0;

            open_in_chrome(chrome_exe_path, folder_path, e);

            e.button = 2;

            open_in_chrome(chrome_exe_path, folder_path, e);
        }

    } catch (er) {
        err(er, 145);
    }
};

export const update_chrome_exe_paths_observable = action(() => {
    try {
        ob.chrome_exe_paths = store.get('chrome_exe_paths');

    } catch (er) {
        err(er, 47);
    }
});

export const update_chrome_user_data_folders_observable = action(() => {
    try {
        ob.chrome_user_data_folders = store.get('chrome_user_data_folders');

    } catch (er) {
        err(er, 47);
    }
});

export const pack = type => {
    folders.check_if_at_least_one_theme_is_selected(() => {
        try {
            const multiple_themes_is_selected = folders.check_if_multiple_themes_is_selected(true);
            let theme_paths_to_pack = [chosen_folder_path.ob.chosen_folder_path];

            if (multiple_themes_is_selected) {
                theme_paths_to_pack = chosen_folder_path.exclude_non_themes();

                if (folders.check_if_folder_is_theme(chosen_folder_path.ob.chosen_folder_path)) {
                    theme_paths_to_pack.unshift(chosen_folder_path.ob.chosen_folder_path);
                }
            }

            if (theme_paths_to_pack.length > chosen_folder_path.mut.confirm_breakpoint) {
                const dialog_options = confirm.generate_confirm_options('pack_confirm_msg', 'pack_confirm_answer_pack');
                const choice = remote.dialog.showMessageBox(confirm.con.win, dialog_options);

                if (choice === 0) {
                    pack_inner(type, theme_paths_to_pack);
                }

            } else {
                pack_inner(type, theme_paths_to_pack);
            }

        } catch (er) {
            err(er, 285);
        }
    });
};

const pack_inner = (type, theme_paths_to_pack) => {
    processing_msg.process(async () => {
        try {
            await Promise.all(theme_paths_to_pack.map(async theme_path => {
                const directory_to_save_package_in = theme_path.substring(
                    0,
                    theme_path.lastIndexOf(sep),
                );
                const package_name = theme_path.substring(theme_path.lastIndexOf(sep) + 1);
                const pak_path = join(theme_path, 'Cached Theme.pak');
                const system_path = join(theme_path, 'system');
                const work_folder_system_path = join(choose_folder.ob.work_folder, 'system');

                move_system_folder(system_path, work_folder_system_path);

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

                    // eslint-disable-next-line no-new
                    await new Promise(resolve => {
                        zipLocal.zip(theme_path, (er, zip) => {
                            if (!er) {
                                zip.compress().save(zip_path);

                                move_system_folder(work_folder_system_path, system_path);

                                resolve();

                            } else {
                                resolve();

                                err(er, 5, null, false, false, true);
                            }
                        });
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

                    execFileSync(getChrome(platform()), [`--pack-extension=${theme_path}`]);

                    move_system_folder(work_folder_system_path, system_path);
                }

                if (tutorial.ob.tutorial_stage === 7) {
                    tutorial.increment_tutorial_stage(true, true);
                }

                return undefined;
            }));

        } catch (er) {
            err(er, 17);
        }
    });
};

const move_system_folder = (src, destination) => {
    if (existsSync(src)) {
        moveSync(src, destination, { overwrite: true });
    }
};

const mut = {
    chrome_process_ids: {},
    chrome_incognito_process_ids: {},
};

export const ob = observable({
    chrome_exe_paths: '',
    chrome_user_data_folders: '',
});
