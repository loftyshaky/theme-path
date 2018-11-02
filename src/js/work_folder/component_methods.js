import { observable, action, configure } from 'mobx';
import Store from 'electron-store';

import * as shared from 'js/shared';

const store = new Store();
configure({ enforceActions: 'observed' });

//--

export const select_root_folder = action(() => {
    shared.ob.chosen_folder_path = store.get('work_folder');
});

export const show_or_hide_choose_work_folder_btn = action(scroll_info => {
    ob.show_work_folder_selector = scroll_info.scrollTop === 0;
});

//> variables
export const ob = observable({
    show_work_folder_selector: true,
});
//< variables
