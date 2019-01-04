import { action, configure } from 'mobx';

import * as shared from 'js/shared';
import * as analytics from 'js/analytics';
import * as choose_folder from 'js/work_folder/choose_folder';

configure({ enforceActions: 'observed' });

//--

export const select_work_folder = action(() => {
    try {
        if (choose_folder.reset_work_folder(false)) {
            const folder_is_already_selected = shared.ob.chosen_folder_path === choose_folder.ob.work_folder;

            shared.ob.chosen_folder_path = choose_folder.ob.work_folder;

            if (!folder_is_already_selected) {
                analytics.add_work_folder_analytics('selected_work_folder');
            }
        }

    } catch (er) {
        err(er, 71);
    }
});
