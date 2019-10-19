import { action, configure } from 'mobx';

import x from 'x';
import * as chosen_folder_path from 'js/chosen_folder_path';
import * as folders from 'js/work_folder/folders';

configure({ enforceActions: 'observed' });

export const search = action(() => {
    try {
        const query = con.search_input[0] ? con.search_input[0].value : '';

        if (query !== '') {
            mut.filtered_folders = folders.ob.folders.filter(folder => folder.nest_level !== 0 || folder.name.toLowerCase().indexOf(query) > -1);

        } else {
            mut.filtered_folders = folders.ob.folders;
        }

    } catch (er) {
        err(er, 149);
    }
});

export const trigger_work_folder_reload = x.debounce(action(() => {
    try {
        folders.collapse_all_folders();
        chosen_folder_path.deselect_all_bulk_folders();

        //> trigger Work_folder component rerender
        const { chosen_folder_path: old_chosen_folder_path } = chosen_folder_path.ob;
        chosen_folder_path.ob.chosen_folder_path = '';
        chosen_folder_path.ob.chosen_folder_path = old_chosen_folder_path;
        //< trigger Work_folder component rerender

    } catch (er) {
        err(er, 148);
    }
}), 200);

export const remove_search_val = () => {
    con.search_input[0].value = '';
};

export const mut = {
    filtered_folders: null,
};

const con = {
    search_input: document.getElementsByClassName('search_input'),
};
