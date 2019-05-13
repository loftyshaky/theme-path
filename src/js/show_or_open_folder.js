import { ipcRenderer } from 'electron';

import * as chosen_folder_path from 'js/chosen_folder_path';

export const show_or_open_folder = mode => {
    try {
        if (chosen_folder_path.ob.chosen_folder_path !== '') {
            ipcRenderer.send(`${mode}_folder`, chosen_folder_path.ob.chosen_folder_path);

        } else {
            const er_obj_v = er_obj('Cant open folder');

            err(er_obj_v, 143, 'cant_open_folder');
        }

    } catch (er) {
        err(er, 144, 'cant_open_folder');
    }
};
