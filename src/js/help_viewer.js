import { resolve } from 'path';
import { readFileSync } from 'fs-extra';

import { action, observable, configure } from 'mobx';

import x from 'x';

configure({ enforceActions: 'observed' });

export const open_help_viewer = action((family, name) => {
    try {
        const no_image_families = ['theme_metadata', 'settings'];

        if (family && no_image_families.indexOf(family) === -1) {
            const data_basename = `${family}_${name}`;
            const img_path = resolve('resources', 'app', 'bundle', 'help_imgs', `${data_basename}.png`);
            const img_base_64 = readFileSync(img_path).toString('base64');

            ob.help_viewer_name = name;
            ob.help_viewer_message = x.message(`${data_basename}_help_text`);
            ob.help_viewer_img = `data:image/png;base64,${img_base_64}`;

        } else if (no_image_families.indexOf(family) > -1) {
            ob.help_viewer_name = '';
            ob.help_viewer_message = x.message(`${family}_${name}_help_text`);
            ob.help_viewer_img = '';

        } else {
            ob.help_viewer_name = '';
            ob.help_viewer_message = x.message(`${name}_help_text`);
            ob.help_viewer_img = '';
        }

        show_help_viewer(true);

    } catch (er) {
        err(er, 133);
    }
});

export const on_help_viewer_click = e => {
    try {
        const clicked_on_help_viewer_expanded_img = x.matches(e.target, '.help_viewer_expanded_img');
        const clicked_on_help_viewer_img = x.matches(e.target, '.help_viewer_img');

        if (clicked_on_help_viewer_img) {
            show_help_viewer_expanded_img(true);

        } else if (clicked_on_help_viewer_expanded_img) {
            show_help_viewer_expanded_img(false);

        } else {
            show_help_viewer(false);
        }

    } catch (er) {
        err(er, 134);
    }
};

export const show_help_viewer = action(bool => {
    try {
        ob.help_viewer_is_visible = bool;

    } catch (er) {
        err(er, 135);
    }
});

export const none_help_viewer = action(bool => {
    try {
        ob.help_viewer_is_none = bool;

    } catch (er) {
        err(er, 136);
    }
});

const show_help_viewer_expanded_img = action(bool => {
    try {
        ob.help_viewer_expanded_img_is_visible = bool;

    } catch (er) {
        err(er, 137);
    }
});

export const deactivate_all = () => {
    try {
        none_help_viewer(true);
        show_help_viewer(false);
        show_help_viewer_expanded_img(false);

    } catch (er) {
        err(er, 138);
    }
};

export const close_help_viewer_by_keyboard = e => {
    const esc_pressed = e.keyCode === 27;

    if (esc_pressed) {
        if (ob.help_viewer_expanded_img_is_visible) {
            show_help_viewer_expanded_img(false);

        } else if (ob.help_viewer_is_visible) {
            show_help_viewer(false);
        }
    }
};

//> variables
export const ob = observable({
    help_viewer_is_none: false,
    help_viewer_is_visible: false,
    help_viewer_expanded_img_is_visible: false,
    help_viewer_name: '',
    help_viewer_message: '',
    help_viewer_img: '',
});
//< variables
