import { join } from 'path';
import { existsSync } from 'fs-extra';
import recursiveReaddir from 'recursive-readdir';

import * as chosen_folder_path from 'js/chosen_folder_path';
import * as json_file from 'js/json_file';
import * as processing_msg from 'js/processing_msg';
import * as confirm from 'js/confirm';
import * as choose_folder from 'js/work_folder/choose_folder';

// eslint-disable-next-line import/no-extraneous-dependencies
const remote = require('@electron/remote');

export const mut = {
    manifest: null,
};

export const reload_manifest = () => {
    try {
        const manifest_path = join(chosen_folder_path.ob.chosen_folder_path, 'manifest.json');

        if (existsSync(manifest_path)) {
            mut.manifest = json_file.parse_json(manifest_path);
        }
    } catch (er) {
        err(er, 202);
    }
};

export const update_manifest_version_of_all_themes_to_v3 = async () => {
    try {
        const dialog_options = confirm.generate_confirm_options(
            'update_manifest_version_of_all_themes_to_v3_msg',
            'update_manifest_version_of_all_themes_to_v3_answer_update',
        );
        const choice = remote.dialog.showMessageBoxSync(confirm.con.win, dialog_options);

        if (choice === 0) {
            processing_msg.process(async () => {
                const files = await recursiveReaddir(choose_folder.ob.work_folder);

                const manifest_files_paths = files.filter(
                    (file) => file.indexOf('manifest.json') > -1,
                );

                manifest_files_paths.forEach((manifest_path) => {
                    try {
                        const json = json_file.parse_json(manifest_path);

                        if (json && json.manifest_version === 2) {
                            json.manifest_version = 3;

                            json_file.write_to_json(json, manifest_path);
                        }
                    } catch (er) {
                        err(er, 341);
                    }
                });
            });
        }
    } catch (er) {
        err(er, 340);
    }
};
