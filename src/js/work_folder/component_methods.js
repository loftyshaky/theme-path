import { observable, action, configure } from 'mobx';

import * as shared from 'js/shared';
import * as choose_folder from 'js/work_folder/choose_folder';

configure({ enforceActions: 'observed' });

//--

export const select_root_folder = action(() => {
    try {
        shared.ob.chosen_folder_path = choose_folder.ob.work_folder;

    } catch (er) {
        err(er, 71);
    }
});

export const show_or_hide_choose_work_folder_btn = action(scroll_info => {
    try {
        ob.show_work_folder_selector = scroll_info.scrollTop === 0;

    } catch (er) {
        err(er, 72);
    }
});

//> variables
export const ob = observable({
    show_work_folder_selector: true,
});
//< variables
