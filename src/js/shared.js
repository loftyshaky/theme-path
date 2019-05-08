import { join } from 'path';

//--

export const val_is_localized = val => {
    try {
        return val.indexOf('__MSG_') > -1;

    } catch (er) {
        err(er, 60);
    }

    return undefined;
};

export const get_message_name = val => {
    try {
        return val.replace(/__MSG_|__/g, '');

    } catch (er) {
        err(er, 61);
    }

    return undefined;
};

export const construct_icons_obj = json => {
    try {
        const new_json = json;

        if (!json.icons) {
            new_json.icons = {};
        }

        if (!json['128']) {
            new_json['128'] = {};
        }

    } catch (er) {
        err(er, 64);
    }
};

export const get_icon_paths = () => {
    try {
        const default_icon_soure_path = join(app_root, 'resources', 'app', 'bundle', 'new_theme', 'icon.png');
        const default_icon_target_path = join(ob.chosen_folder_path, 'icon.png');

        return {
            source: default_icon_soure_path,
            target: default_icon_target_path,
        };

    } catch (er) {
        err(er, 66);
    }

    return undefined;
};

//> varibles t
export const mut = {
    manifest: null,
};
//< varibles t
