export const imgs = (family, name) =>
    (family === 'images' && name !== 'theme_ntp_background') || name === 'icon';

export const imgs_2 = (family, name) => family === 'images' || name === 'icon';

export const colors = (family) => family === 'colors' || family === 'tints';

export const selects = (family, name) =>
    family === 'properties' ||
    (family === 'clear_new_tab' && name !== 'clear_new_tab_video' && name !== 'video_speed') ||
    (family === 'theme_metadata' && name === 'default_locale');

export const textareas = (family, name) =>
    family === 'theme_metadata' &&
    (name === 'name' || name === 'description' || name === 'version');

export const textareas_with_default_checkbox = (family, name) =>
    family === 'clear_new_tab' && name === 'video_speed';
