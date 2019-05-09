import { action, observable, configure } from 'mobx';

import * as choose_folder from 'js/work_folder/choose_folder';

configure({ enforceActions: 'observed' });

export const set_chosen_folder_path = action(chosen_folder_path => {
    try {
        ob.chosen_folder_path = chosen_folder_path;

    } catch (er) {
        err(er, 56);
    }
});

export const ob = observable({
    chosen_folder_path: choose_folder.ob.work_folder,
});
