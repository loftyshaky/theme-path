import { existsSync, outputFileSync, writeJsonSync, readFileSync } from 'fs-extra';

import { join } from 'path';

import * as manifest from 'js/manifest';
import * as chosen_folder_path from 'js/chosen_folder_path';


export const create_json_file = (path, content) => {
    try {
        const messages_file_exist = existsSync(path);

        if (!messages_file_exist) {
            outputFileSync(path, content, 'utf8');
        }

    } catch (er) {
        err(er, 26);
    }
};

export const parse_json = file_path => {
    try {
        return JSON.parse(readFileSync(file_path, 'utf-8').trim());

    } catch (er) {
        err(er, 57, null, true);
    }

    return undefined;
};

export const write_to_json = (json, json_path) => {
    try {
        writeJsonSync(json_path, json, { spaces: 4 });

    } catch (er) {
        err(er, 65, null, false, false, true);
    }
};

export const write_to_manifest_json = () => {
    write_to_json(manifest.mut.manifest, join(chosen_folder_path.ob.chosen_folder_path, 'manifest.json'));
};
