import { join, extname } from 'path';
import { existsSync, copySync, writeFileSync, removeSync } from 'fs-extra';

import { observable, action } from 'mobx';
import * as r from 'ramda';
import Store from 'electron-store';
import Jimp from 'jimp';
import imageSize from 'image-size';

import * as chosen_folder_path from 'js/chosen_folder_path';
import * as change_val from 'js/change_val';
import { inputs_data } from 'js/inputs_data';
import * as picked_colors from 'js/picked_colors';
import * as options from 'js/options';
import * as history from 'js/history';
import * as reupload_img from 'js/reupload_img';
import * as conds from 'js/conds';
import * as folders from 'js/work_folder/folders';

const store = new Store();

const con = {
    ext: {
        theme_ntp_background: ['png', 'jpg', 'jpeg', 'gif'],
        icon: ['png', 'jpg', 'jpeg'],
        clear_new_tab_video: ['mp4', 'webm', 'ogv', 'gif'],
        common: ['png'],
    },
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

export const set_dims = action((family, name, dims) => {
    try {
        inputs_data.obj[family][name].img_dims = dims;
    } catch (er) {
        err(er, 313);
    }
});

export const get_dims = (family, name) => {
    try {
        if (conds.imgs_2(family, name)) {
            let dims = {
                width: null,
                height: null,
            };
            let img_path;
            const img_name = folders.find_file_name_by_element_name(name);

            if (img_name) {
                img_path = join(chosen_folder_path.ob.chosen_folder_path, img_name);
            }

            if (img_path && existsSync(img_path)) {
                dims = imageSize(img_path);
            }

            set_dims(family, name, dims);
        }
    } catch (er) {
        err(er, 312);
    }
};

export const remove_img_by_name = (name, target_folder_path) => {
    try {
        const file_name = folders.find_file_name_by_element_name(name, target_folder_path);

        if (file_name) {
            removeSync(
                join(target_folder_path || chosen_folder_path.ob.chosen_folder_path, file_name),
            );
        }
    } catch (er) {
        err(er, 231);
    }
};

//> image upload
const previously_uploaded_img_doesnt_exists_err = () => {
    err(
        er_obj("Previously uploaded image doesn't exists"),
        241,
        'previously_uploaded_img_doesnt_exists',
    );
};

export const copy_img = (name, img_extension, src_img_path, target_folder_path) => {
    try {
        copySync(
            src_img_path,
            join(
                target_folder_path || chosen_folder_path.ob.chosen_folder_path,
                `${name}${img_extension}`,
            ),
        ); // copy image
    } catch (er) {
        err(er, 242);
    }
};

const record_img_change = (family, name) => {
    try {
        const was_default = inputs_data.obj[family][name].default;

        if (conds.imgs(family, name)) {
            return history.record_change(() =>
                history.generate_img_history_obj(family, name, was_default, null, false),
            );
        }
    } catch (er) {
        err(er, 244);
    }

    return undefined;
};

export const handle_files = async (mode, file, family, name) => {
    try {
        const uploading_img = mode === 'browse_upload' || mode === 'dnd_upload';
        let reuploaded_img = false;
        let img_extension;
        let uploaded_file_is_valid;

        if (uploading_img) {
            const valid_file_types = r.cond([
                [r.equals('theme_ntp_background'), () => ['image/png', 'image/jpeg', 'image/gif']],
                [r.equals('icon'), () => ['image/png', 'image/jpeg']],
                [
                    r.equals('clear_new_tab_video'),
                    () => ['video/mp4', 'video/webm', 'video/ogg', 'image/gif'],
                ],
                [r.T, () => ['image/png']],
            ])(name);

            let file_path;

            if (mode === 'dnd_upload') {
                file_path = file[0].path;
                uploaded_file_is_valid = valid_file_types.indexOf(file[0].type) > -1;
            } else if (mode === 'browse_upload') {
                file_path = file;
                uploaded_file_is_valid = true;
            }

            if (uploaded_file_is_valid) {
                const history_obj = record_img_change(family, name);
                img_extension = extname(file_path); // .png

                remove_img_by_name(name);

                copy_img(name, img_extension, file_path);

                history.copy_to_history_folder(
                    family,
                    name,
                    history_obj ? history_obj.to_img_id : null,
                    file_path,
                );

                reupload_img.record_img_path(file_path, family, name);
            } else {
                err(er_obj('Invalid file type'), 2, 'invalid_file_type');
            }
        } else if (mode === 'reupload') {
            folders.check_if_selected_folder_is_theme(() => {
                const previous_img_obj = store.get('previous_img');

                if (existsSync(previous_img_obj.path)) {
                    const img_path = previous_img_obj.path;
                    family = previous_img_obj.family; // eslint-disable-line no-param-reassign, prefer-destructuring
                    name = previous_img_obj.name; // eslint-disable-line no-param-reassign, prefer-destructuring

                    if (img_path && family && name) {
                        if (existsSync(img_path)) {
                            const history_obj = record_img_change(family, name);

                            remove_img_by_name(name);

                            img_extension = extname(img_path); // .png

                            copy_img(name, img_extension, img_path);

                            history.copy_to_history_folder(
                                family,
                                name,
                                history_obj ? history_obj.to_img_id : null,
                                img_path,
                            );

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

        if ((uploading_img && uploaded_file_is_valid) || reuploaded_img) {
            change_val.change_val(family, name, name, img_extension, true, true);

            picked_colors.remove_picked_color(family, name);

            const { color_input_default } = options.ob.theme_vals[store.get('theme')];

            change_val.set_inputs_data_color(family, name, color_input_default);
        }

        get_dims(family, name);
    } catch (er) {
        err(er, 14);
    }
};
//< image upload

export const create_solid_color_image = (family, name, hex, alpha, history_obj) => {
    try {
        const width = con.width[name] ? con.width[name] : 1;
        const height = con.height[name] ? con.height[name] : 1;

        // eslint-disable-next-line no-new
        new Jimp(width, height, hex, (er, img) => {
            // eslint-disable-line no-new
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

                    writeFileSync(
                        join(chosen_folder_path.ob.chosen_folder_path, `${name}.png`),
                        base_64_data,
                        'base64',
                    );

                    if (history_obj) {
                        history.copy_to_history_folder(
                            family,
                            name,
                            history_obj.to_img_id,
                            join(chosen_folder_path.ob.chosen_folder_path, `${name}.png`),
                        );
                    }

                    get_dims(family, name);
                } catch (er3) {
                    err(er3, 1);
                }
            });
        });
    } catch (er) {
        err(er, 38);
    }
};

export const reset_upload_btn_val = action(() => {
    try {
        ob.file_input_value = '';
    } catch (er) {
        err(er, 39);
    }
});

//> drag and drop
export const prevent_default_dnd_actions = (e) => {
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
        mut.drag_counter += 1;

        inputs_data.obj[family][name].highlight_upload_box = true;
    } catch (er) {
        err(er, 42);
    }
});

export const dehighlight_upload_box_on_drag_leave = action((family, name) => {
    try {
        mut.drag_counter -= 1;

        if (mut.drag_counter === 0) {
            inputs_data.obj[family][name].highlight_upload_box = false;
        }
    } catch (er) {
        err(er, 43);
    }
});
//< drag and drop

export const select_allowed_extension = action((name) => {
    try {
        return con.ext[name] ? con.ext[name] : con.ext.common;
    } catch (er) {
        err(er, 314);
    }

    return undefined;
});
