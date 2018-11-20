import { shell } from 'electron';

import * as shared from 'js/shared';

export const show_folder = () => {
    const shown = shell.showItemInFolder(shared.ob.chosen_folder_path);

    if (!shown) {
        err(er_obj('Cant show folder'), 140);
    }
};

export const open_folder = () => {
    const opened = shell.openItem(shared.ob.chosen_folder_path);

    if (!opened) {
        err(er_obj('Cant open folder'), 141);
    }
};
