import { action, configure } from 'mobx';

import x from 'x';
import * as shared from 'js/shared';
import * as wf_shared from 'js/work_folder/wf_shared';

configure({ enforceActions: 'observed' });

export const search = action(() => {
    try {
        const query = sta.search_input[0] ? sta.search_input[0].value : '';

        if (query !== '') {
            mut.filtered_folders = wf_shared.ob.folders.filter(folder => folder.nest_level !== 0 || folder.name.toLowerCase().indexOf(query) > -1);

        } else {
            mut.filtered_folders = wf_shared.ob.folders;
        }

    } catch (er) {
        err(er, 149);
    }
});

export const trigger_work_folder_reload = x.debounce(action(() => {
    try {
        wf_shared.close_all_folders();

        //> trigger Work_folder component rerender
        const { chosen_folder_path } = shared.ob;
        shared.ob.chosen_folder_path = '';
        shared.ob.chosen_folder_path = chosen_folder_path;
        //< trigger Work_folder component rerender

    } catch (er) {
        err(er, 148);
    }
}), 1000);

export const remove_search_val = () => {
    sta.search_input[0].value = '';
};

//> varibles
export const mut = {
    filtered_folders: null,
};

const sta = {
    search_input: document.getElementsByClassName('search_input'),
};
//< varibles
