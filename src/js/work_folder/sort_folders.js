import * as r from 'ramda';

import x from 'x';
import * as folders from 'js/work_folder/folders';

export const sort_folders_inner = (folders_to_sort) =>
    r.sort((a, b) => a.name.localeCompare(b.name), folders_to_sort);

export const sort_folders = (folders_to_sort, added_folder_path, start_i, nest_level) => {
    const only_one_folder = folders_to_sort.length === 1; // total number of folders with added folder is one
    const new_folders = r.ifElse(
        () => only_one_folder,
        () => folders_to_sort,

        () => {
            const number_of_folders =
                folders.get_number_of_folders_to_work_with(start_i, nest_level) + 1; // get number of folders from the first folder (and including it) in folder tree where added folder will be contained till the last folder (and including it) in this tree
            const folders_of_nest_level_folder_inserted_in = folders_to_sort.filter(
                (folder, i) =>
                    folder.path === added_folder_path ||
                    (i >= start_i &&
                        i <= start_i + number_of_folders &&
                        folder.nest_level === nest_level),
            ); // remove all folders with nest level !== inserted folder nest level
            const sorted_folders = sort_folders_inner(folders_of_nest_level_folder_inserted_in); // sort folders of nest level of added folder
            const added_folder_sorted_i = sorted_folders.findIndex(
                (folder) => folder.path === added_folder_path,
            ); // get index of added folder
            const sorted_folders_without_added_folder = r.reject(
                (folder) => folder.path === added_folder_path,
                sorted_folders,
            ); // remove added folder from sorted_folders array
            const previous_folder = sorted_folders_without_added_folder[added_folder_sorted_i - 1]; // attempt to get folder before added folder from sorted_folders_without_added_folder array
            const added_folder_relative = previous_folder || sorted_folders_without_added_folder[0]; // if previous folder doesn't exist in sorted_folders_without_added_folder select first folder from sorted_folders_without_added_folder
            const added_folder_relative_i = folders_to_sort.findIndex(
                (folder) => folder.path === added_folder_relative.path,
            );
            const added_folder_is_first_folder_in_sorted_folder = !previous_folder; // in_sorted_folder = inside sorted_folders_without_added_folder
            const insert_i = added_folder_is_first_folder_in_sorted_folder
                ? added_folder_relative_i - 1
                : folders_to_sort.findIndex(
                      (folder, i) => i > added_folder_relative_i && folder.nest_level <= nest_level,
                  ) - 1; // ? select previous folder to added_folder_relative : select the first folder (from all folders, that is folders array) after added_folder_relative with equal nest_level to nest_level or below nest_level than nest_level
            const new_folders_inner = x.move(0, insert_i, folders_to_sort);

            return new_folders_inner;
        },
    )();

    return new_folders;
};
