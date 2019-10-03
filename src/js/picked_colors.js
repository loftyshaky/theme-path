import { join } from 'path';
import { existsSync } from 'fs';

import * as chosen_folder_path from 'js/chosen_folder_path';
import * as json_file from 'js/json_file';
import * as color_pickiers from 'js/color_pickiers';

export const record_picked_color = (family, name) => {
    try {
        const picked_colors_path = join(chosen_folder_path.ob.chosen_folder_path, con.picked_colors_sdb_path);

        json_file.create_json_file(picked_colors_path, '{}');

        const picked_colors_obj = json_file.parse_json(picked_colors_path);

        if (!picked_colors_obj[family]) {
            picked_colors_obj[family] = {};
        }

        picked_colors_obj[family][name] = color_pickiers.mut.current_pickied_color;

        json_file.write_to_json(picked_colors_obj, picked_colors_path);

    } catch (er) {
        err(er, 186);
    }
};

export const remove_picked_color = (family, name) => {
    try {
        const picked_colors_path = join(chosen_folder_path.ob.chosen_folder_path, con.picked_colors_sdb_path);

        if (existsSync(picked_colors_path)) {
            const picked_colors_obj = json_file.parse_json(picked_colors_path);

            if (picked_colors_obj[family]) {
                delete picked_colors_obj[family][name];
            }

            json_file.write_to_json(picked_colors_obj, picked_colors_path);
        }

    } catch (er) {
        err(er, 249);
    }
};

export const get_picked_colors_obj = () => {
    try {
        const picked_colors_path = join(chosen_folder_path.ob.chosen_folder_path, con.picked_colors_sdb_path);

        const picked_colors_obj = existsSync(picked_colors_path) ? json_file.parse_json(picked_colors_path) : null;

        return picked_colors_obj;

    } catch (er) {
        err(er, 250);
    }

    return undefined;
};

export const con = {
    picked_colors_sdb_path: join('system', 'picked_colors.json'),
};
