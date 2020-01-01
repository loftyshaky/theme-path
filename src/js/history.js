import { join, basename, resolve } from 'path';
import { promisify } from 'util';
import { existsSync, copySync, moveSync, removeSync, readdir, stat } from 'fs-extra';

import * as r from 'ramda';
import { observable, action, toJS, configure } from 'mobx';
import Store from 'electron-store';
import { remote } from 'electron';

import x from 'x';
import { inputs_data, set_inputs_data } from 'js/inputs_data';
import * as analytics from 'js/analytics';
import * as chosen_folder_path from 'js/chosen_folder_path';
import * as manifest from 'js/manifest';
import * as json_file from 'js/json_file';
import * as change_val from 'js/change_val';
import * as color_pickiers from 'js/color_pickiers';
import * as set_default_or_disabled from 'js/set_default_or_disabled';
import * as picked_colors from 'js/picked_colors';
import * as options from 'js/options';
import * as conds from 'js/conds';
import * as processing_msg from 'js/processing_msg';
import * as confirm from 'js/confirm';
import * as new_theme_or_rename from 'js/work_folder/new_theme_or_rename';
import * as folders from 'js/work_folder/folders';
import * as choose_folder from 'js/work_folder/choose_folder';
import * as imgs from 'js/imgs';

const readdir_p = promisify(readdir);
const stat_p = promisify(stat);
configure({ enforceActions: 'observed' });
const store = new Store();

export const load_history = () => {
    try {
        folders.check_if_selected_folder_is_theme(() => {
            try {
                mut.scroll_to_bottom_of_history = true;
                mut.initial_inputs_data = toJS(inputs_data.obj);

                show_or_hide_history(true);
                set_history();
                change_revert_position(Infinity, false);

            } catch (er) {
                err(er, 204);
            }
        });

    } catch (er) {
        err(er, 203);
    }
};

export const revert_tinker = revert_position => {
    try {
        const direction = revert_position > mut.reverted_history.revert_position ? 'forward' : 'backward';
        let clicked_on_start_record;
        let changes_to_revert;
        mut.changes_to_revert = ob.history.filter((not_used, i) => i + 1 > revert_position);

        change_revert_position(revert_position, true);
        set_inputs_data(mut.initial_inputs_data);

        if (direction === 'forward') {
            changes_to_revert = ob.history.filter((not_used, i) => i + 1 > mut.reverted_history.revert_position && i + 1 <= revert_position);
            clicked_on_start_record = revert_position === mut.reverted_history.revert_position;

        } else if (direction === 'backward') {
            // eslint-disable-next-line prefer-destructuring
            changes_to_revert = mut.changes_to_revert.slice().reverse();
            clicked_on_start_record = mut.changes_to_revert.length === 0;
        }

        if (!clicked_on_start_record) {
            for (const change_to_revert of changes_to_revert) {
                const change = unpack_change(change_to_revert, direction);

                if (conds.imgs(change.family, change.name)) {
                    color_pickiers.set_color_input_vizualization_color(change.family, change.name, change.val || options.ob.theme_vals[options.ob.theme].color_input_default);

                } else if (conds.colors(change.family)) {
                    color_pickiers.set_color_input_vizualization_color(change.family, change.name, change.val || (change.default ? options.ob.theme_vals[options.ob.theme].color_input_default : options.ob.theme_vals[options.ob.theme].color_input_disabled));

                    if (change.family === 'tints') {
                        change_val.set_disabled_bool(change.family, change.name, change.disabled);
                    }

                } else if (conds.selects(change.family, change.name)) {
                    change_val.set_inputs_data_val(change.family, change.name, change.val);

                } else if (conds.textareas(change.family, change.name)) {
                    if (change.locale === inputs_data.obj.theme_metadata.locale.val || change.name === 'version') {
                        change_val.set_inputs_data_val(change.family, change.name, change.val);
                    }
                }

                if (conds.colors(change.family) || conds.imgs(change.family, change.name)) {
                    change_val.set_default_bool(change.family, change.name, change.default);
                }
            }
        }

        analytics.add_history_analytics('history_item');

    } catch (er) {
        err(er, 209);
    }
};

export const accept_history_change = () => {
    processing_msg.process(() => {
        try {
            manifest.reload_manifest();

            const direction = ob.revert_position > mut.reverted_history.revert_position ? 'forward' : 'backward';
            const reverting_last_history_record = ob.history.length === ob.revert_position;
            let changes_to_revert;
            let number_of_changes;
            let clicked_on_start_record;
            let new_folder_name = null;

            if (direction === 'forward') {
                clicked_on_start_record = ob.revert_position === mut.reverted_history.revert_position;

                changes_to_revert = ob.history.filter((not_used, i) => i + 1 > mut.reverted_history.revert_position && i + 1 <= ob.revert_position);

            } else if (direction === 'backward') {
                clicked_on_start_record = number_of_changes === 0;
                changes_to_revert = mut.changes_to_revert.slice().reverse();
            }

            if (!clicked_on_start_record) {
                for (const change_to_revert of changes_to_revert) {
                    const change = unpack_change(change_to_revert, direction);

                    if (conds.imgs(change.family, change.name)) {
                        const path_to_manifest_img = join(chosen_folder_path.ob.chosen_folder_path, `${change.name}.png`);

                        if (!change.default) {
                            change_val.change_val(change.family, change.name, change.name, '.png', false, false);

                            if (direction === 'forward') {
                                move_images_revert(change, path_to_manifest_img, 'reverted_history', 'history', 'all', false, true);

                            } else if (direction === 'backward') {
                                move_images_revert(change, path_to_manifest_img, 'history', 'reverted_history', 'all', true, false);
                            }

                        } else {
                            change_val.set_default_bool(change.family, change.name, true);
                            picked_colors.remove_picked_color(change.family, change.name);

                            if (direction === 'forward') {
                                move_images_revert(change, path_to_manifest_img, 'reverted_history', 'history', 1, false, false);

                            } else if (direction === 'backward') {
                                move_images_revert(change, path_to_manifest_img, 'history', 'reverted_history', 2, false, false);
                            }

                            removeSync(path_to_manifest_img);

                            if (change.name !== 'icon') {
                                set_default_or_disabled.delete_key_from_manifest(change.family, change.name);

                            } else {
                                set_default_or_disabled.set_default_icon(change.family, change.name, false);
                            }
                        }

                    } else if (conds.colors(change.family)) {
                        if (!change.default) {
                            if (!manifest.mut.manifest.theme[change.family]) {
                                manifest.mut.manifest.theme[change.family] = {};
                            }

                            if (!change.disabled) {
                                manifest.mut.manifest.theme[change.family][change.name] = change.manifest_val;

                            } else {
                                manifest.mut.manifest.theme[change.family][change.name] = set_default_or_disabled.con.disabled_manifest_val;
                            }

                        } else {
                            picked_colors.remove_picked_color(change.family, change.name);
                            set_default_or_disabled.delete_key_from_manifest(change.family, change.name);
                        }

                    } else if (conds.selects(change.family, change.name)) {
                        if (change.val === 'default') {
                            set_default_or_disabled.set_default_or_disabled(change.family, change.name, 'select', false);

                        } else {
                            change_val.change_val(change.family, change.name, change.val, null, false, false);
                        }


                    } else if (conds.textareas(change.family, change.name)) {
                        if (change.name === 'version') {
                            change_val.change_val(change.family, change.name, change.val, null, false, false);
                            change_val.set_previous_val(change.family, change.name, change.val);

                        } else {
                            if (change.name === 'name' && change.locale === inputs_data.obj[change.family].default_locale.val) {
                                new_folder_name = change.val;
                            }

                            change_val.update_name_or_description(change.name, change.val, change.locale);
                        }
                    }

                    if (conds.imgs(change.family, change.name) || conds.colors(change.family)) {
                        if (change.picked_color_val) {
                            color_pickiers.mut.current_pickied_color = change.picked_color_val;

                            picked_colors.record_picked_color(change.family, change.name);

                        } else {
                            picked_colors.remove_picked_color(change.family, change.name);
                        }
                    }

                    imgs.get_dims(change.family, change.name);
                }

                change_val.set_previous_val('theme_metadata', 'name', inputs_data.obj.theme_metadata.name.val);
                change_val.set_previous_val('theme_metadata', 'description', inputs_data.obj.theme_metadata.description.val);

                let history_arr;

                if (!reverting_last_history_record) {
                    history_arr = ob.history.filter((not_used, i) => i < ob.revert_position);

                } else {
                    history_arr = ob.history;

                    remove_reverted_history();
                }

                json_file.write_to_json(history_arr, get_history('history'));
                json_file.write_to_manifest_json();
            }

            if (!reverting_last_history_record) {
                const reverted_history = {};
                reverted_history.history = mut.changes_to_revert;
                reverted_history.revert_position = ob.revert_position;

                json_file.write_to_json(reverted_history, get_history('reverted_history'));
            }

            change_revert_position(Infinity, false);
            show_or_hide_history(false);

            if (new_folder_name) {
                new_theme_or_rename.rename_theme_folder(new_folder_name);
            }

            analytics.add_history_analytics('history_accept');

        } catch (er) {
            err(er, 205);
        }
    });
};

export const cancel_history_change = () => {
    try {
        set_inputs_data(mut.initial_inputs_data);
        change_revert_position(Infinity, false);
        show_or_hide_history(false);

    } catch (er) {
        err(er, 206);
    }
};

export const generate_img_history_obj = (family, name, was_default, to_val, set_to_default, target_folder_path) => {
    try {
        const from_img_path = join(target_folder_path || chosen_folder_path.ob.chosen_folder_path, `${name}.png`);
        const from_img_id = x.unique_id();
        const to_img_id = x.unique_id();
        const copy_img = existsSync(from_img_path) && !was_default;

        if (copy_img) {
            copy_to_history_folder(family, name, from_img_id, from_img_path, target_folder_path);
        }

        const from_picked_color_val = get_picked_color_from(family, name, target_folder_path);

        const rgba_css_val = r.ifElse(
            () => to_val,
            () => color_pickiers.convert_rgba_arr_into_string(to_val),

            () => null,
        )();

        return {
            timestamp: get_timestamp(),
            family,
            name,
            was_default,
            set_to_default,
            ...(from_picked_color_val && { from_val: color_pickiers.convert_rgba_arr_into_string(from_picked_color_val) }),
            ...(from_picked_color_val && { from_picked_color_val }),
            ...(rgba_css_val && { to_val: rgba_css_val }),
            ...(rgba_css_val && { to_picked_color_val: to_val }),
            ...(copy_img && { from_img_id }),
            ...(!set_to_default && { to_img_id }),
        };

    } catch (er) {
        err(er, 225);
    }

    return undefined;
};

export const generate_color_history_obj = (family, name, was_default, was_disabled, from_val, from_manifest_val, to_val, to_picked_color_val, to_manifest_val, set_to_default, set_to_disabled, target_folder_path) => {
    const from_picked_color_val = get_picked_color_from(family, name, target_folder_path);
    const switched_from_default_to_disabled_or_from_disabled_to_default = (was_default && set_to_disabled) || (was_disabled && set_to_default);

    try {
        return {
            timestamp: get_timestamp(),
            family,
            name,
            was_default,
            was_disabled,
            set_to_default,
            set_to_disabled,
            ...(from_val && !switched_from_default_to_disabled_or_from_disabled_to_default && { from_val }),
            ...(family === 'colors' && from_picked_color_val && { from_picked_color_val }),
            ...(from_manifest_val && !switched_from_default_to_disabled_or_from_disabled_to_default && { from_manifest_val }),
            ...(to_val && { to_val }),
            ...(family === 'colors' && to_picked_color_val && { to_picked_color_val }),
            ...(to_manifest_val && { to_manifest_val }),
        };

    } catch (er) {
        err(er, 222);
    }

    return undefined;
};

export const generate_select_history_obj = (family, name, was_default, from_val, to_val, set_to_default) => {
    try {
        return {
            timestamp: get_timestamp(),
            family,
            name,
            was_default,
            set_to_default,
            from_val: from_val.toString(),
            to_val: to_val.toString(),
        };

    } catch (er) {
        err(er, 222);
    }

    return undefined;
};


export const generate_textarea_history_obj = (family, name, from_val, to_val, locale) => {
    try {
        return {
            timestamp: get_timestamp(),
            family,
            name,
            ...((name === 'name' || name === 'description') && { locale: locale || inputs_data.obj.theme_metadata.locale.val }),
            from_val: from_val ? from_val.toString() : '',
            to_val: to_val ? to_val.toString() : '',
        };

    } catch (er) {
        err(er, 224);
    }

    return undefined;
};

export const record_change = (generate_history_obj_f, target_folder_path) => {
    try {
        const max_number_of_history_records = store.get('max_number_of_history_records');
        const is_digit = /^\d+$/.test(max_number_of_history_records); // true even if number is of type string

        if (is_digit && max_number_of_history_records > 0) {
            const history_arr = get_history_arr('history', target_folder_path);
            const history = get_history('history', target_folder_path);

            const history_obj = generate_history_obj_f();

            history_arr.push(history_obj);

            while (history_arr.length > max_number_of_history_records) {
                const { from_img_id } = history_arr[0];

                if (from_img_id) { // is image record with image in history folder
                    const path_to_img_to_delete = join(target_folder_path || chosen_folder_path.ob.chosen_folder_path, con.folder_paths.history, `${from_img_id}.png`);

                    removeSync(path_to_img_to_delete);
                }

                history_arr.shift();
            }

            json_file.create_json_file(history, '[]');
            json_file.write_to_json(history_arr, history);

            return history_obj;
        }

    } catch (er) {
        err(er, 223);
    }

    return undefined;
};

const get_timestamp = () => new Date().getTime();

const get_history_arr = (history_key, target_folder_path) => {
    try {
        const history = get_history(history_key, target_folder_path);

        const history_arr = r.ifElse(
            () => existsSync(history),
            () => json_file.parse_json(history),

            () => (history_key === 'reverted_history' ? { history: [], revert_position: Infinity } : []),
        )();

        return history_arr;

    } catch (er) {
        err(er, 200);
    }

    return undefined;
};

const get_history = (history_key, target_folder_path) => join(target_folder_path || chosen_folder_path.ob.chosen_folder_path, con.file_paths[history_key]);

export const get_date_from_timestamp = timestamp => {
    try {
        const obj = new Date(timestamp);
        const year = obj.getFullYear();
        const month = con.months[obj.getMonth()];
        const date = obj.getDate();
        const hour = obj.getHours();
        const min = obj.getMinutes() < 10 ? `0${obj.getMinutes()}` : obj.getMinutes();
        const sec = obj.getSeconds() < 10 ? `0${obj.getSeconds()}` : obj.getSeconds();
        const time = `${date} ${month} ${year} ${hour}:${min}:${sec}`;

        return time;

    } catch (er) {
        err(er, 208);
    }

    return undefined;
};

const get_picked_color_from = (family, name, target_folder_path) => {
    try {
        const picked_colors_path = join(target_folder_path || chosen_folder_path.ob.chosen_folder_path, picked_colors.con.picked_colors_sdb_path);
        let from_picked_color_val;

        if (existsSync(picked_colors_path)) {
            const picked_colors_obj = json_file.parse_json(picked_colors_path);

            if (picked_colors_obj && picked_colors_obj[family] && picked_colors_obj[family][name]) {
                from_picked_color_val = picked_colors_obj[family][name];
            }
        }

        return from_picked_color_val;

    } catch (er) {
        err(er, 263);
    }

    return undefined;
};

export const show_or_hide_history = action(bool => {
    try {
        ob.history_is_visible = bool;

    } catch (er) {
        err(er, 199);
    }
});

const set_history = action(() => {
    try {
        const history = get_history_arr('history');
        const reverted_history = get_history_arr('reverted_history');

        ob.history = r.concat(history, reverted_history.history);
        mut.reverted_history = reverted_history;

        get_changes_to_revert(history.length);

    } catch (er) {
        err(er, 210);
    }
});

const change_revert_position = action((revert_position, force_provided) => {
    try {
        const old_revert_position = r.isNil(mut.reverted_history.revert_position) ? revert_position : mut.reverted_history.revert_position;
        ob.revert_position = force_provided ? revert_position : old_revert_position;

    } catch (er) {
        err(er, 211);
    }
});

const get_changes_to_revert = revert_position => {
    try {
        mut.changes_to_revert = r.drop(revert_position, ob.history);

    } catch (er) {
        err(er, 221);
    }
};

export const set_history_side_popup_width = () => {
    try {
        s('.history_side_popup').style.width = `${store.get('history_side_popup_width')}px`;

    } catch (er) {
        err(er, 213);
    }
};

const unpack_change = (change, direction) => {
    try {
        const { family, name, locale, from_img_id, to_img_id, from_val, from_picked_color_val, from_manifest_val, to_picked_color_val, to_manifest_val, to_val, was_default, was_disabled, set_to_default, set_to_disabled } = change;

        return {
            family,
            name,
            locale,
            default: direction === 'forward' ? set_to_default : was_default,
            disabled: direction === 'forward' ? set_to_disabled : was_disabled,
            val: direction === 'forward' ? to_val : from_val,
            picked_color_val: direction === 'forward' ? to_picked_color_val : from_picked_color_val,
            manifest_val: direction === 'forward' ? to_manifest_val : from_manifest_val,
            img_id: direction === 'forward' ? to_img_id : from_img_id,
            from_img_id,
            to_img_id,
        };

    } catch (er) {
        err(er, 297);
    }

    return undefined;
};

export const remove_reverted_history = target_folder_path => {
    try {
        removeSync(get_history('reverted_history', target_folder_path));
        removeSync(join(target_folder_path || chosen_folder_path.ob.chosen_folder_path, con.folder_paths.reverted_history));

    } catch (er) {
        err(er, 296);
    }
};

export const copy_to_history_folder = (family, name, img_id, img_path, target_folder_path) => {
    try {
        if (conds.imgs(family, name)) {
            copySync(
                img_path,
                join(target_folder_path || chosen_folder_path.ob.chosen_folder_path, con.folder_paths.history, `${img_id}.png`),
            );
        }

    } catch (er) {
        err(er, 298);
    }
};


const move_images_revert = (change, path_to_manifest_img, imgs_folder_1_name, imgs_folder_2_name, run_block, copy_in_block_1, copy_in_block_2) => {
    try {
        if (change.from_img_id && (run_block === 'all' || run_block === 1)) {
            const from_img_src = join(chosen_folder_path.ob.chosen_folder_path, con.folder_paths[imgs_folder_1_name], `${change.from_img_id}.png`);
            const from_img_target = join(chosen_folder_path.ob.chosen_folder_path, con.folder_paths[imgs_folder_2_name], `${change.from_img_id}.png`);

            if (existsSync(from_img_src)) {
                if (copy_in_block_1) {
                    copySync(from_img_src, path_to_manifest_img);
                }

                moveSync(from_img_src, from_img_target);
            }
        }

        if (change.to_img_id && (run_block === 'all' || run_block === 2)) {
            const to_img_src = join(chosen_folder_path.ob.chosen_folder_path, con.folder_paths[imgs_folder_1_name], `${change.to_img_id}.png`);
            const to_img_target = join(chosen_folder_path.ob.chosen_folder_path, con.folder_paths[imgs_folder_2_name], `${change.to_img_id}.png`);

            if (existsSync(to_img_src)) {
                if (copy_in_block_2) {
                    copySync(to_img_src, path_to_manifest_img);
                }

                moveSync(to_img_src, to_img_target);
            }
        }

    } catch (er) {
        err(er, 299);
    }
};

export const delete_all_history = async () => {
    try {
        const dialog_options = confirm.generate_confirm_options('delete_all_history_msg', 'delete_all_history_answer_delete');
        const choice = remote.dialog.showMessageBox(confirm.con.win, dialog_options);

        analytics.add_options_btns_analytics('tried_to_delete_all_history');

        if (choice === 0) {
            analytics.add_options_btns_analytics('deleted_all_history');

            const get_files_and_folders = async folder => {
                const dirs = [];
                const subdirs = await readdir_p(folder);
                const files = await Promise.all(subdirs.map(async sub_folder => {
                    const res = resolve(folder, sub_folder);
                    const is_directory = (await stat_p(res)).isDirectory();

                    if (is_directory) {
                        dirs.push(res);
                    }

                    return is_directory ? get_files_and_folders(res) : res;
                }));

                return dirs.concat(files.reduce((a, f) => a.concat(f), []));
            };

            processing_msg.process(async () => {
                try {
                    const files = await get_files_and_folders(choose_folder.ob.work_folder);
                    const files_to_delete = files.filter(file => {
                        const file_name = basename(file);
                        return file_name === 'history.json' || file_name === 'previous_img.json' || file_name === 'reverted_history.json' || file_name === 'history' || file_name === 'reverted_history' || file_name === 'old_imgs';
                    });

                    for (const file_to_delete of files_to_delete) {
                        try {
                            removeSync(file_to_delete);

                        } catch (er) {
                            err(er, 308, null, true);
                        }
                    }

                    color_pickiers.convert_picked_colors_from_objects_to_arrays(files);

                } catch (er) {
                    err(er, 304);
                }
            });
        } else {
            analytics.add_options_btns_analytics('canceled_deleting_all_history');
        }

    } catch (er) {
        err(er, 303);
    }
};

export const met = {
    reset_history_side_popup_content: null,
};

const con = {
    file_paths: {
        history: join('system', 'history.json'),
        reverted_history: join('system', 'reverted_history.json'),
    },
    folder_paths: {
        history: join('system', 'history'),
        reverted_history: join('system', 'reverted_history'),
    },
    months: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].map(month => x.msg(month)),
};

export const mut = {
    reverted_history: {},
    changes_to_revert: [],
    initial_inputs_data: null,
    scroll_to_bottom_of_history: false,
};

export const ob = observable({
    history: [],
    history_is_visible: false,
    revert_position: Infinity,
    reset_history_side_popup_content: null,
});
