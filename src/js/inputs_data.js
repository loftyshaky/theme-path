'use strict';

import x from 'x';

import { observable, configure } from "mobx";
import * as r from 'ramda';

configure({ enforceActions: 'observed' });

const yellow = '#fbff75';

export const reset_inputs_data = () => {
    inputs_data.obj = data_obj_default;
}

export let inputs_data = observable({
    obj: {
        theme_metadata: [
            {
                key: x.unique_id(),
                name: 'version',
                family: 'theme_metadata',
                type: 'textarea',
                val: ''
            },
            {
                key: x.unique_id(),
                name: 'locale',
                family: 'theme_metadata',
                type: 'select',
                val: '',
                add_help: true
            },
            {
                key: x.unique_id(),
                name: 'name',
                family: 'theme_metadata',
                type: 'textarea',
                val: ''
            },
            {
                key: x.unique_id(),
                name: 'description',
                family: 'theme_metadata',
                type: 'textarea',
                val: ''
            },
            {
                key: x.unique_id(),
                name: 'default_locale',
                family: 'theme_metadata',
                type: 'select',
                val: '',
                add_help: true
            },
        ],
        images: [
            {
                key: x.unique_id(),
                name: 'theme_ntp_background',
                family: 'images',
                type: 'img_selector',
                val: '',
                color: yellow,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true
            },
            {
                key: x.unique_id(),
                name: 'theme_toolbar',
                family: 'images',
                type: 'img_selector',
                val: '',
                color: yellow,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true
            },
            {
                key: x.unique_id(),
                name: 'theme_frame',
                family: 'images',
                type: 'img_selector',
                val: '',
                color: yellow,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true
            },
            {
                key: x.unique_id(),
                name: 'theme_frame_inactive',
                family: 'images',
                type: 'img_selector',
                val: '',
                color: yellow,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true
            },
            {
                key: x.unique_id(),
                name: 'theme_frame_incognito',
                family: 'images',
                type: 'img_selector',
                val: '',
                color: yellow,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true
            },
            {
                key: x.unique_id(),
                name: 'theme_frame_incognito_inactive',
                family: 'images',
                type: 'img_selector',
                val: '',
                color: yellow,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true
            },
            {
                key: x.unique_id(),
                name: 'theme_frame_overlay',
                family: 'images',
                type: 'img_selector',
                val: '',
                color: yellow,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true
            },
            {
                key: x.unique_id(),
                name: 'theme_tab_background',
                family: 'images',
                type: 'img_selector',
                val: '',
                color: yellow,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true
            },
            {
                key: x.unique_id(),
                name: 'theme_tab_background_incognito',
                family: 'images',
                type: 'img_selector',
                val: '',
                color: yellow,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true
            },
            {
                key: x.unique_id(),
                name: 'theme_window_control_background',
                family: 'images',
                type: 'img_selector',
                val: '',
                color: yellow,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true
            },
            {
                key: x.unique_id(),
                name: 'theme_ntp_attribution',
                family: 'images',
                type: 'img_selector',
                val: '',
                color: yellow,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true
            }
        ],
        colors: [
            {
                key: x.unique_id(),
                name: 'ntp_background',
                family: 'colors',
                type: 'color',
                val: yellow,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true
            },
            {
                key: x.unique_id(),
                name: 'toolbar',
                family: 'colors',
                type: 'color',
                val: yellow,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true
            },
            {
                key: x.unique_id(),
                name: 'frame',
                family: 'colors',
                type: 'color',
                val: yellow,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true
            },
            {
                key: x.unique_id(),
                name: 'frame_inactive',
                family: 'colors',
                type: 'color',
                val: yellow,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true
            },
            {
                key: x.unique_id(),
                name: 'frame_incognito',
                family: 'colors',
                type: 'color',
                val: yellow,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true
            },
            {
                key: x.unique_id(),
                name: 'frame_incognito_inactive',
                family: 'colors',
                type: 'color',
                val: yellow,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true
            },
            {
                key: x.unique_id(),
                name: 'bookmark_text',
                family: 'colors',
                type: 'color',
                val: yellow,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true
            },
            {
                key: x.unique_id(),
                name: 'tab_text',
                family: 'colors',
                type: 'color',
                val: yellow,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true
            },
            {
                key: x.unique_id(),
                name: 'tab_background_text',
                family: 'colors',
                type: 'color',
                val: yellow,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true
            },
            {
                key: x.unique_id(),
                name: 'button_background',
                family: 'colors',
                type: 'color',
                val: yellow,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true
            },
            {
                key: x.unique_id(),
                name: 'ntp_text',
                family: 'colors',
                type: 'color',
                val: yellow,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true
            }
        ],
        tints: [
            {
                key: x.unique_id(),
                name: 'frame',
                family: 'tints',
                type: 'color',
                val: yellow,
                disable: false,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true
            },
            {
                key: x.unique_id(),
                name: 'frame_inactive',
                family: 'tints',
                type: 'color',
                val: yellow,
                disable: false,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true
            },
            {
                key: x.unique_id(),
                name: 'frame_incognito',
                family: 'tints',
                type: 'color',
                val: yellow,
                disable: false,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true
            },
            {
                key: x.unique_id(),
                name: 'frame_incognito_inactive',
                family: 'tints',
                type: 'color',
                val: yellow,
                disable: false,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true
            },
            {
                key: x.unique_id(),
                name: 'background_tab',
                family: 'tints',
                type: 'color',
                val: yellow,
                disable: false,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true
            },
            {
                key: x.unique_id(),
                name: 'buttons',
                family: 'tints',
                type: 'color',
                val: yellow,
                disable: false,
                color_pickier_is_visible: false,
                color_pickiers_position: 'top',
                default: true
            }
        ],
        properties: [
            {
                key: x.unique_id(),
                name: 'ntp_background_alignment',
                family: 'properties',
                type: 'select',
                val: '',
                add_help: true
            },
            {
                key: x.unique_id(),
                name: 'ntp_background_repeat',
                family: 'properties',
                type: 'select',
                val: '',
                add_help: true
            },
            {
                key: x.unique_id(),
                name: 'ntp_logo_alternate',
                family: 'properties',
                type: 'select',
                val: '',
                add_help: true
            }
        ],
        settings: [
            {
                key: x.unique_id(),
                name: 'theme',
                family: 'settings',
                type: 'select',
                val: ''
            },
            {
                key: x.unique_id(),
                name: 'chrome_user_data_dirs',
                family: 'settings',
                type: 'textarea',
                val: '',
                add_help: true
            }
        ]
    }
});

const data_obj_default = r.clone(inputs_data.obj);

observable(inputs_data);