import { existsSync } from 'fs-extra';

import { action, observable } from 'mobx';
import Store from 'electron-store';

const store = new Store();

export const ob = observable({
    previous_img_path: null,
});

export const set_current_previous_img_path_ob = action(() => {
    try {
        const previous_img_file_path = store.get('previous_img').path;

        if (existsSync(previous_img_file_path)) {
            ob.previous_img_path = previous_img_file_path;
        } else {
            ob.previous_img_path = null;
        }
    } catch (er) {
        err(er, 243);
    }
});

export const record_img_path = (img_path, family, name) => {
    try {
        const previous_img_obj = {
            path: img_path,
            family,
            name,
        };

        store.set('previous_img', previous_img_obj);

        set_current_previous_img_path_ob();
    } catch (er) {
        err(er, 240);
    }
};
