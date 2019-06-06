import { join } from 'path';
import { existsSync } from 'fs-extra';

import { action, observable, configure } from 'mobx';

import * as chosen_folder_path from 'js/chosen_folder_path';
import * as json_file from 'js/json_file';

configure({ enforceActions: 'observed' });


export const record_img_path = (img_path, family, name) => {
    try {
        const previous_img_file_path = join(chosen_folder_path.ob.chosen_folder_path, con.previous_img_file_path);

        json_file.create_json_file(previous_img_file_path, '{}');

        const previous_img_obj = json_file.parse_json(previous_img_file_path);

        previous_img_obj.path = img_path;
        previous_img_obj.family = family;
        previous_img_obj.name = name;

        json_file.write_to_json(previous_img_obj, previous_img_file_path);

        set_current_previous_img_path_ob();

    } catch (er) {
        err(er, 240);
    }
};

export const set_current_previous_img_path_ob = action(() => {
    try {
        const previous_img_file_path = join(chosen_folder_path.ob.chosen_folder_path, con.previous_img_file_path);

        if (existsSync(previous_img_file_path)) {
            const previous_img_obj = json_file.parse_json(previous_img_file_path);
            ob.previous_img_path = previous_img_obj.path;

        } else {
            ob.previous_img_path = null;
        }

    } catch (er) {
        err(er, 243);
    }
});

export const con = {
    previous_img_file_path: join('system', 'previous_img.json'),
};

export const ob = observable({
    previous_img_path: null,
});
