import { action, configure } from 'mobx';

import * as shared from 'js/shared';
import * as choose_folder from 'js/work_folder/choose_folder';

configure({ enforceActions: 'observed' });

//--

export const select_root_folder = action(() => {
    try {
        if (choose_folder.reset_work_folder(false)) {
            shared.ob.chosen_folder_path = choose_folder.ob.work_folder;
        }

    } catch (er) {
        err(er, 71);
    }
});
