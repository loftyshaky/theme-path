'use_strict';

import { join } from 'path';
import { copySync, writeFileSync } from 'fs-extra';

import { observable, action, configure } from 'mobx';
import * as r from 'ramda';
import Jimp from 'jimp';

import * as shared from 'js/shared';
import * as change_val from 'js/change_val';
import { inputs_data } from 'js/inputs_data';

configure({ enforceActions: 'observed' });

//--

export const create_solid_color_image = (name, color) => {
    try {
        const width = sta.width[name] ? sta.width[name] : 1;
        const height = sta.height[name] ? sta.height[name] : 200;

        new Jimp(width, height, color, (er, img) => { // eslint-disable-line no-new
            if (er) {
                err(er, 11);
            }

            img.getBase64(Jimp.AUTO, (er2, data) => {
                if (er2) {
                    err(er2, 12);
                }

                try {
                    const base_64_data = data.replace(/^data:image\/png;base64,/, '');

                    writeFileSync(join(shared.ob.chosen_folder_path, `${name}.png`), base_64_data, 'base64');

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
export const handle_files = async (file, family, i) => {
    try {
        const img_name = inputs_data.obj[family][i].name;
        const valid_file_types = r.cond([
            [r.equals('theme_ntp_background'), () => ['image/png', 'image/jpeg', 'image/gif']],
            [r.equals('icon'), () => ['image/png', 'image/jpeg']],
            [r.T, () => ['image/png']],
        ])(img_name);

        if (valid_file_types.indexOf(file[0].type) > -1) {
            const img_extension = file[0].name.substring(file[0].name.lastIndexOf('.') + 1); // .png

            change_val.change_val(family, i, img_name, img_extension);

            copySync(file[0].path, join(shared.ob.chosen_folder_path, `${img_name}.${img_extension}`)); // copy image

        } else {
            err(er_obj('Invalid image type'), 2, 'invalid_img_type');
        }

    } catch (er) {
        err(er, 14);
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

export const dehighlight_upload_box_on_drop = action((family, i) => {
    try {
        mut.drag_counter = 0;
        inputs_data.obj[family][i].highlight_upload_box = false;

    } catch (er) {
        err(er, 41);
    }
});

export const highlight_upload_box_on_drag_enter = action((family, i) => {
    try {
        mut.drag_counter++;

        inputs_data.obj[family][i].highlight_upload_box = true;

    } catch (er) {
        err(er, 42);
    }
});

export const dehighlight_upload_box_on_drag_leave = action((family, i) => {
    try {
        mut.drag_counter--;

        if (mut.drag_counter === 0) {
            inputs_data.obj[family][i].highlight_upload_box = false;
        }

    } catch (er) {
        err(er, 43);
    }
});
//< drag and drop

//> variables
const sta = {
    width: {
        icon: 128,
        theme_ntp_background: window.screen.width,
        theme_frame_overlay: 1100,
        theme_frame_overlay_inactive: 1100,
        theme_ntp_attribution: 100,
    },
    height: {
        icon: 128,
        theme_ntp_background: window.screen.height,
        theme_ntp_attribution: 50,
    },
};

const mut = {
    drag_counter: 0,
};

export const ob = observable({
    file_input_value: '',
});
//< variables
