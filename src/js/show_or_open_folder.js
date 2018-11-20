import { shell } from 'electron';

import * as shared from 'js/shared';

const show_or_open_folder = (fun, err1, err2) => {
    try {
        if (shared.ob.chosen_folder_path !== '') {
            const folder_opened_in_explorer = shell[fun](shared.ob.chosen_folder_path);

            if (!folder_opened_in_explorer) {
                err1();
            }

        } else {
            err2();
        }

    } catch (er) {
        err(er, 144);
    }
};

export const show_folder = () => {
    const er_obj_instance = er_obj('Cant show folder');

    show_or_open_folder('showItemInFolder', err.bind(null, er_obj_instance, 140), err.bind(null, er_obj_instance, 141, 'cant_show_folder'));
};

export const open_folder = () => {
    const er_obj_instance = er_obj('Cant open folder');

    show_or_open_folder('openItem', err.bind(null, er_obj_instance, 142), err.bind(null, er_obj_instance, 143, 'cant_open_folder'));
};
