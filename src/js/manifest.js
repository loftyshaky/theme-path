import { join } from 'path';
import { existsSync } from 'fs-extra';

import * as chosen_folder_path from 'js/chosen_folder_path';
import * as json_file from 'js/json_file';

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
