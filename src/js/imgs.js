'use_strict';

import x from 'x';

import * as shared from 'js/shared';
import { inputs_data } from 'js/inputs_data';

const { writeFileSync } = require('fs');

const fs = require('fs');

var Jimp = require('jimp');

export const create_solid_color_image = (name, color) => {
    const width = sta.width[name] ? sta.width[name] : 1;
    const height = sta.height[name] ? sta.height[name] : 200;

    new Jimp(width, height, color, (err, img) => {
        img.getBase64(Jimp.AUTO, (er, data) => {
            try {
                const base_64_data = data.replace(/^data:image\/png;base64,/, "");

                writeFileSync(shared.ob.chosen_folder_path + '/' + name + '.png', base_64_data, 'base64');

            } catch (er) {
                console.error(er);

                x.error(1);
            }
        });
    });
};

//> variables
const sta = {
    width: {
        "theme_ntp_background": screen.width,
        "theme_frame_overlay": 1100,
        "theme_frame_overlay_inactive": 1100,
        "theme_ntp_attribution": 100
    },
    height: {
        "theme_ntp_background": screen.height,
        "theme_ntp_attribution": 50
    }
}
//< variables