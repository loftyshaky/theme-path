'use_strict';

import { join, extname } from 'path';
import { existsSync, copySync, writeFileSync, removeSync } from 'fs-extra';

import { observable, action, configure } from 'mobx';
import * as r from 'ramda';
import Store from 'electron-store';
import Jimp from 'jimp';

import * as chosen_folder_path from 'js/chosen_folder_path';
import * as change_val from 'js/change_val';
import { inputs_data } from 'js/inputs_data';
import * as picked_colors from 'js/picked_colors';
import * as options from 'js/options';
import * as history from 'js/history';
import * as reupload_img from 'js/reupload_img';
import * as json_file from 'js/json_file';
import * as folders from 'js/work_folder/folders';

configure({ enforceActions: 'observed' });

const store = new Store();

export const create_solid_color_image = (family, name, hex, alpha) => {
    try {
        const width = sta.width[name] ? sta.width[name] : 1;
        const height = sta.height[name] ? sta.height[name] : 1;

        new Jimp(width, height, hex, (er, img) => { // eslint-disable-line no-new
            if (er) {
                err(er, 11);
            }

            if (family === 'images') {
                img.opacity(alpha); // appply alpha
            }

            img.getBase64(Jimp.AUTO, (er2, data) => {
                if (er2) {
                    err(er2, 12);
                }

                try {
                    const base_64_data = data.replace(/^data:image\/png;base64,/, '');

                    writeFileSync(join(chosen_folder_path.ob.chosen_folder_path, `${name}.png`), base_64_data, 'base64');

                } catch (er3) {
                    err(er3, 1);
                }
            });
        });

    } catch (er) {
        err(er, 38);
    }
};

//> image upload
export const handle_files = async (mode, file, family, name) => {
    try {
        let img_extension;
        let uploaded_file_is_valid;
        let reuploaded_img;

        if (mode === 'upload') {
            const valid_file_types = r.cond([
                [r.equals('theme_ntp_background'), () => ['image/png', 'image/jpeg', 'image/gif']],
                [r.equals('icon'), () => ['image/png', 'image/jpeg']],
                [r.equals('clear_new_tab_video'), () => ['video/mp4', 'video/webm', 'video/ogg', 'image/gif']],
                [r.T, () => ['image/png']],
            ])(name);

            uploaded_file_is_valid = valid_file_types.indexOf(file[0].type) > -1;

            if (uploaded_file_is_valid) {
                record_img_change(family, name);
                remove_img_by_name(name);

                img_extension = extname(file[0].path); // .png

                copy_img(file[0].path, name, img_extension);

                reupload_img.record_img_path(file[0].path, family, name);

            } else {
                err(er_obj('Invalid file type'), 2, 'invalid_file_type');
            }

        } else if (mode === 'reupload') {
            folders.check_if_selected_folder_is_theme(() => {
                const previous_img_file_path = join(chosen_folder_path.ob.chosen_folder_path, reupload_img.con.previous_img_file_path);

                if (existsSync(previous_img_file_path)) {
                    const previous_img_obj = json_file.parse_json(previous_img_file_path);
                    const img_path = previous_img_obj.path;
                    family = previous_img_obj.family; // eslint-disable-line no-param-reassign, prefer-destructuring
                    name = previous_img_obj.name; // eslint-disable-line no-param-reassign, prefer-destructuring

                    if (img_path && family && name) {
                        if (existsSync(img_path)) {
                            record_img_change(family, name);
                            remove_img_by_name(name);

                            img_extension = extname(img_path); // .png

                            copy_img(img_path, name, img_extension);

                            reuploaded_img = true;

                        } else {
                            previously_uploaded_img_doesnt_exists_err();
                        }

                    } else {
                        previously_uploaded_img_doesnt_exists_err();
                    }

                } else {
                    previously_uploaded_img_doesnt_exists_err();
                }
            });
        }

        if ((mode === 'upload' && uploaded_file_is_valid) || reuploaded_img) {
            change_val.change_val(family, name, name, img_extension, true);

            picked_colors.remove_picked_color(family, name);

            const { color_input_default } = options.ob.theme_vals[store.get('theme')];

            change_val.set_inputs_data_color(family, name, color_input_default);
        }

    } catch (er) {
        err(er, 14);
    }
};

const previously_uploaded_img_doesnt_exists_err = () => {
    err(er_obj('Previously uploaded image doesn\'t exists'), 241, 'previously_uploaded_img_doesnt_exists');
};

const copy_img = (path, name, img_extension) => {
    try {
        copySync(path, join(chosen_folder_path.ob.chosen_folder_path, `${name}${img_extension}`)); // copy image

    } catch (er) {
        err(er, 242);
    }
};

const record_img_change = (family, name) => {
    try {
        const was_default = inputs_data.obj[family][name].default;

        if (history.imgs_cond(family, name)) {
            history.record_change(() => history.generate_img_history_obj(family, name, was_default, null, false));
        }

    } catch (er) {
        err(er, 244);
    }
};
//< image upload

export const reset_upload_btn_val = action(() => {
    try {
        ob.file_input_value = '';

    } catch (er) {
        err(er, 39);
    }
});

//> drag and drop
export const prevent_default_dnd_actions = e => {
    try {
        e.stopPropagation();
        e.preventDefault();

    } catch (er) {
        err(er, 40);
    }
};

export const dehighlight_upload_box_on_drop = action((family, name) => {
    try {
        mut.drag_counter = 0;
        inputs_data.obj[family][name].highlight_upload_box = false;

    } catch (er) {
        err(er, 41);
    }
});

export const highlight_upload_box_on_drag_enter = action((family, name) => {
    try {
        mut.drag_counter++;

        inputs_data.obj[family][name].highlight_upload_box = true;

    } catch (er) {
        err(er, 42);
    }
});

export const dehighlight_upload_box_on_drag_leave = action((family, name) => {
    try {
        mut.drag_counter--;

        if (mut.drag_counter === 0) {
            inputs_data.obj[family][name].highlight_upload_box = false;
        }

    } catch (er) {
        err(er, 43);
    }
});
//< drag and drop


export const remove_img_by_name = name => {
    try {
        const file_with_name = folders.find_file_with_exist(name);

        if (file_with_name) {
            removeSync(join(chosen_folder_path.ob.chosen_folder_path, file_with_name));
        }

    } catch (er) {
        err(er, 231);
    }
};

const sta = {
    width: {
        icon: 128,
        theme_ntp_background: 1,
        theme_frame_overlay: 1100,
        theme_frame_overlay_inactive: 1100,
        theme_ntp_attribution: 100,
    },
    height: {
        icon: 128,
        theme_frame_overlay: 200,
        theme_frame_overlay_inactive: 200,
        theme_ntp_attribution: 50,
    },
};

const mut = {
    drag_counter: 0,
};

export const ob = observable({
    file_input_value: '',
});
