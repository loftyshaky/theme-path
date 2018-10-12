'use strict';

import x from 'x';

import { observable, configure } from "mobx";

configure({ enforceActions: 'observed' });

export const inputs_data = observable({
    theme_metadata: [
        {
            key: x.unique_id(),
            name: 'version',
            family: 'theme_metadata',
            type: 'textarea',
            value: ''
        },
        {
            key: x.unique_id(),
            name: 'locale',
            family: 'theme_metadata',
            type: 'select',
            value: '',
            add_help: true
        },
        {
            key: x.unique_id(),
            name: 'name',
            family: 'theme_metadata',
            type: 'textarea',
            value: ''
        },
        {
            key: x.unique_id(),
            name: 'description',
            family: 'theme_metadata',
            type: 'textarea',
            value: ''
        },
        {
            key: x.unique_id(),
            name: 'default_locale',
            family: 'theme_metadata',
            type: 'select',
            value: '',
            add_help: true
        },
    ],
    images: [
        {
            key: x.unique_id(),
            name: 'theme_ntp_background',
            family: 'images',
            type: 'img_selector',
            value: '',
            default: true
        },
        {
            key: x.unique_id(),
            name: 'theme_toolbar',
            family: 'images',
            type: 'img_selector',
            value: '',
            default: true
        },
        {
            key: x.unique_id(),
            name: 'theme_frame',
            family: 'images',
            type: 'img_selector',
            value: '',
            default: true
        },
        {
            key: x.unique_id(),
            name: 'theme_frame_inactive',
            family: 'images',
            type: 'img_selector',
            value: '',
            default: true
        },
        {
            key: x.unique_id(),
            name: 'theme_frame_incognito',
            family: 'images',
            type: 'img_selector',
            value: '',
            default: true
        },
        {
            key: x.unique_id(),
            name: 'theme_frame_incognito_inactive',
            family: 'images',
            type: 'img_selector',
            value: '',
            default: true
        },
        {
            key: x.unique_id(),
            name: 'theme_frame_overlay',
            family: 'images',
            type: 'img_selector',
            value: '',
            default: true
        },
        {
            key: x.unique_id(),
            name: 'theme_tab_background',
            family: 'images',
            type: 'img_selector',
            value: '',
            default: true
        },
        {
            key: x.unique_id(),
            name: 'theme_tab_background_incognito',
            family: 'images',
            type: 'img_selector',
            value: '',
            default: true
        },
        {
            key: x.unique_id(),
            name: 'theme_window_control_background',
            family: 'images',
            type: 'img_selector',
            value: '',
            default: true
        },
        {
            key: x.unique_id(),
            name: 'theme_ntp_attribution',
            family: 'images',
            type: 'img_selector',
            value: '',
            default: true
        }
    ],
    colors: [
        {
            key: x.unique_id(),
            name: 'ntp_background',
            family: 'colors',
            type: 'color',
            value: '',
            default: true
        },
        {
            key: x.unique_id(),
            name: 'toolbar',
            family: 'colors',
            type: 'color',
            value: '',
            default: true
        },
        {
            key: x.unique_id(),
            name: 'frame',
            family: 'colors',
            type: 'color',
            value: '',
            default: true
        },
        {
            key: x.unique_id(),
            name: 'frame_inactive',
            family: 'colors',
            type: 'color',
            value: '',
            default: true
        },
        {
            key: x.unique_id(),
            name: 'frame_incognito',
            family: 'colors',
            type: 'color',
            value: '',
            default: true
        },
        {
            key: x.unique_id(),
            name: 'frame_incognito_inactive',
            family: 'colors',
            type: 'color',
            value: '',
            default: true
        },
        {
            key: x.unique_id(),
            name: 'bookmark_text',
            family: 'colors',
            type: 'color',
            value: '',
            default: true
        },
        {
            key: x.unique_id(),
            name: 'tab_text',
            family: 'colors',
            type: 'color',
            value: '',
            default: true
        },
        {
            key: x.unique_id(),
            name: 'tab_background_text',
            family: 'colors',
            type: 'color',
            value: '',
            default: true
        },
        {
            key: x.unique_id(),
            name: 'button_background',
            family: 'colors',
            type: 'color',
            value: '',
            default: true
        },
        {
            key: x.unique_id(),
            name: 'ntp_text',
            family: 'colors',
            type: 'select',
            value: '',
            add_help: true
        }
    ],
    tints: [
        {
            key: x.unique_id(),
            name: 'frame',
            family: 'tints',
            type: 'color',
            value: '',
            default: true
        },
        {
            key: x.unique_id(),
            name: 'frame_inactive',
            family: 'tints',
            type: 'color',
            value: '',
            default: true
        },
        {
            key: x.unique_id(),
            name: 'frame_incognito',
            family: 'tints',
            type: 'color',
            value: '',
            default: true
        },
        {
            key: x.unique_id(),
            name: 'frame_incognito_inactive',
            family: 'tints',
            type: 'color',
            value: '',
            default: true
        },
        {
            key: x.unique_id(),
            name: 'background_tab',
            family: 'tints',
            type: 'color',
            value: '',
            default: true
        },
        {
            key: x.unique_id(),
            name: 'buttons',
            family: 'tints',
            type: 'color',
            value: '',
            default: true
        }
    ],
    properties: [
        {
            key: x.unique_id(),
            name: 'ntp_background_alignment',
            family: 'properties',
            type: 'select',
            value: '',
            add_help: true
        },
        {
            key: x.unique_id(),
            name: 'ntp_background_repeat',
            family: 'properties',
            type: 'select',
            value: '',
            add_help: true
        },
        {
            key: x.unique_id(),
            name: 'ntp_logo_alternate',
            family: 'properties',
            type: 'select',
            value: '',
            add_help: true
        }
    ],
    settings: [
        {
            key: x.unique_id(),
            name: 'theme',
            family: 'settings',
            type: 'select',
            value: ''
        },
        {
            key: x.unique_id(),
            name: 'chrome_user_data_dirs',
            family: 'settings',
            type: 'textarea',
            value: '',
            add_help: true
        }
    ]
});