import { join } from 'path';

import * as chosen_folder_path from 'js/chosen_folder_path';

export const construct_icons_obj = (json) => {
    try {
        const new_json = json;

        if (!json.icons) {
            new_json.icons = {};
        }

        if (!json.icons['128']) {
            new_json.icons['128'] = {};
        }
    } catch (er) {
        err(er, 64);
    }
};

export const get_icon_paths = (target_folder_path) => {
    try {
        const default_icon_soure_path = join(
            app_root,
            'resources',
            'app',
            'bundle',
            'new_theme',
            'icon.png',
        );
        const default_icon_target_path = join(
            target_folder_path || chosen_folder_path.ob.chosen_folder_path,
            'icon.png',
        );

        return {
            source: default_icon_soure_path,
            target: default_icon_target_path,
        };
    } catch (er) {
        err(er, 66);
    }

    return undefined;
};
