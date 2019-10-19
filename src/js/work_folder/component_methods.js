import { action, configure } from 'mobx';

import * as analytics from 'js/analytics';
import * as chosen_folder_path from 'js/chosen_folder_path';
import * as enter_click from 'js/enter_click';
import * as folders from 'js/work_folder/folders';
import * as choose_folder from 'js/work_folder/choose_folder';
import * as select_folder from 'js/work_folder/select_folder';

configure({ enforceActions: 'observed' });

export const select_work_folder = action(e => {
    try {
        if (choose_folder.reset_work_folder(false)) {
            const folder_is_already_selected = chosen_folder_path.ob.chosen_folder_path === choose_folder.ob.work_folder;

            if ((e.type === 'mouseup' && e.button === 2) || (e.type === 'keyup' && e.keyCode === enter_click.con.enter_key_code && (e.ctrlKey || e.shiftKey))) {
                select_folder.select_bulk_by_ctrl_clicking_on_folder(choose_folder.ob.work_folder);

            } else if (!folder_is_already_selected && ((e.type === 'mouseup' && e.button === 0) || (e.type === 'keyup' && e.keyCode === enter_click.con.enter_key_code))) {
                chosen_folder_path.ob.chosen_folder_path = choose_folder.ob.work_folder;

                folders.deselect_theme();
                analytics.add_work_folder_analytics('selected_work_folder');
            }
        }

    } catch (er) {
        err(er, 71);
    }
});
