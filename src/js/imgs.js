'use_strict';

import x from 'x';

import * as shared from 'js/shared';
import * as change_val from 'js/change_val';
import { inputs_data } from 'js/inputs_data';

import { observable, action, configure } from "mobx";
const Jimp = require('jimp');
const { createReadStream, createWriteStream, writeFileSync } = require('fs');

configure({ enforceActions: 'observed' });

export const create_solid_color_image = (name, color) => {
    const width = sta.width[name] ? sta.width[name] : 1;
    const height = sta.height[name] ? sta.height[name] : 200;

    new Jimp(width, height, color, (err, img) => {
        img.getBase64(Jimp.AUTO, (er, data) => {
            try {
                const base_64_data = data.replace(/^data:image\/png;base64,/, "");

                writeFileSync(shared.ob.chosen_folder_path + '\\' + name + '.png', base_64_data, 'base64');

            } catch (er) {
                console.error(er);

                x.error(1);
            }
        });
    });
};

//> image upload
export const handle_files = async (file, family, i) => {
    const valid_file_types = ['image/gif', 'image/jpeg', 'image/png'];

    if (valid_file_types.indexOf(file[0].type) > -1) {
        const img_extension = file[0].name.substring(file[0].name.lastIndexOf(".") + 1); // .png
        const img_name = inputs_data.obj[family][i].name;

        createReadStream(file[0].path).pipe(createWriteStream(shared.ob.chosen_folder_path + '\\' + img_name + '.' + img_extension)); // copy image

        change_val.change_val(family, i, img_name, img_extension);

    } else {
        x.error(2, 'invalid_image_type_alert');
    }
};
//< image upload

export const reset_upload_btn_val = action(() => {
    ob.file_input_value = '';
});

//> drag and drop
export const prevent_default_dnd_actions = e => {
    e.stopPropagation();
    e.preventDefault();
}

export const dehighlight_upload_box_on_drop = action((family, i) => {
    mut.drag_counter = 0;
    inputs_data.obj[family][i].highlight_upload_box = false;
});

export const highlight_upload_box_on_drag_enter = action((family, i) => {
    mut.drag_counter++;

    inputs_data.obj[family][i].highlight_upload_box = true;
});

export const dehighlight_upload_box_on_drag_leave = action((family, i) => {
    mut.drag_counter--;

    if (mut.drag_counter == 0) {
        inputs_data.obj[family][i].highlight_upload_box = false;
    }
});
//< drag and drop

//> variables
const sta = {
    width: {
        "icon": 128,
        "theme_ntp_background": screen.width,
        "theme_frame_overlay": 1100,
        "theme_frame_overlay_inactive": 1100,
        "theme_ntp_attribution": 100
    },
    height: {
        "icon": 128,
        "theme_ntp_background": screen.height,
        "theme_ntp_attribution": 50
    }
}

const mut = {
    drag_counter: 0
}

export const ob = observable({
    file_input_value: ''
});
//< variables