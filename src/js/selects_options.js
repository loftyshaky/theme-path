import x from 'x';

const option = (is_locale_option, label_modifier, val) => {
    try {
        return {
            label: label_modifier ? create_option_data_text_val(is_locale_option, label_modifier) : val,
            value: val || label_modifier,
        };

    } catch (er) {
        err(er, 238);
    }

    return undefined;
};

//> create select label content t
const create_option_data_text_val = (is_locale_option, label_modifier) => {
    try {
        const text = x.msg(`option_${label_modifier}_text`);

        if (is_locale_option) {
            return `${label_modifier} - ${text}`;

        }

        return text;

    } catch (er) {
        err(er, 48);
    }

    return undefined;
};
//< create select label content t

const create_video_volume_options = () => {
    try {
        const video_volume_options = [
            option(false, 'default'),
            {
                label: 0,
                value: 0,
            },
        ];

        for (let i = 100; i > 0; i--) {
            const video_volume_option = {
                label: i,
                value: i,
            };

            video_volume_options.push(video_volume_option);
        }

        return video_volume_options;

    } catch (er) {
        err(er, 188);
    }

    return undefined;
};

export const selects_options = {
    locale: [
        option(true, 'ar'),
        option(true, 'am'),
        option(true, 'bg'),
        option(true, 'bn'),
        option(true, 'ca'),
        option(true, 'cs'),
        option(true, 'da'),
        option(true, 'de'),
        option(true, 'el'),
        option(true, 'en'),
        option(true, 'en_GB'),
        option(true, 'en_US'),
        option(true, 'es'),
        option(true, 'es_419'),
        option(true, 'et'),
        option(true, 'fa'),
        option(true, 'fi'),
        option(true, 'fil'),
        option(true, 'fr'),
        option(true, 'gu'),
        option(true, 'he'),
        option(true, 'hi'),
        option(true, 'hr'),
        option(true, 'hu'),
        option(true, 'id'),
        option(true, 'it'),
        option(true, 'ja'),
        option(true, 'kn'),
        option(true, 'ko'),
        option(true, 'lt'),
        option(true, 'lv'),
        option(true, 'ml'),
        option(true, 'mr'),
        option(true, 'ms'),
        option(true, 'hl'),
        option(true, 'no'),
        option(true, 'pl'),
        option(true, 'pt_BR'),
        option(true, 'pt_PT'),
        option(true, 'ro'),
        option(true, 'ru'),
        option(true, 'sk'),
        option(true, 'sl'),
        option(true, 'sr'),
        option(true, 'sv'),
        option(true, 'sw'),
        option(true, 'ta'),
        option(true, 'te'),
        option(true, 'th'),
        option(true, 'tr'),
        option(true, 'uk'),
        option(true, 'vi'),
        option(true, 'zh_CN'),
        option(true, 'zh_TW'),
    ],
    ntp_background_alignment: [
        option(false, 'default'),
        option(false, 'top'),
        option(false, 'center'),
        option(false, 'bottom'),
        option(false, 'left_top', 'left top'),
        option(false, 'left_center', 'left center'),
        option(false, 'left_bottom', 'left bottom'),
        option(false, 'right_top', 'right top'),
        option(false, 'right_center', 'right center'),
        option(false, 'right_bottom', 'right bottom'),
    ],
    ntp_background_repeat: [
        option(false, 'default'),
        option(false, 'repeat'),
        option(false, 'repeat_y', 'repeat-y'),
        option(false, 'repeat_x', 'repeat-x'),
        option(false, 'no_repeat', 'no-repeat'),
    ],
    ntp_logo_alternate: [
        option(false, 'default'),
        option(false, 'colorful', '0'),
        option(false, 'ntp_logo_alternate_white', '1'),
    ],
    video_volume: create_video_volume_options(),
    size: [
        option(false, 'default'),
        option(false, 'dont_resize'),
        option(false, 'fit_screen'),
        option(false, 'fit_browser'),
        option(false, 'cover_screen'),
        option(false, 'cover_browser'),
        option(false, 'stretch_screen'),
        option(false, 'stretch_browser'),
    ],
    theme: [
        option(false, 'light'),
        option(false, 'dark'),
    ],
    language: [
        option(false, 'system'),
        option(false, 'en'),
        option(false, 'ru'),
    ],
    color_picker_default_mode: [
        option(false, null, 'HEX'),
        option(false, null, 'RGBA'),
        option(false, null, 'HSLA'),
        option(false, null, 'HSVA'),
    ],
};
