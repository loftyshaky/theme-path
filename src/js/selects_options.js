import x from 'x';

//> create select label content t
const create_option_data_text_val = (is_locale_option, modifier) => {
    try {
        const text = x.msg(`option_${modifier}_text`);

        if (is_locale_option) {
            return `${modifier} - ${text}`;

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
            {
                label: create_option_data_text_val(false, 'default'),
                value: 'default',
            },
            {
                label: 0,
                value: 0,
            },
        ];

        for (let i = 100; i > 0; i--) {
            const option = {
                label: i,
                value: i,
            };

            video_volume_options.push(option);
        }

        return video_volume_options;

    } catch (er) {
        err(er, 188);
    }

    return undefined;
};

export const selects_options = {
    locale: [
        {
            label: create_option_data_text_val(true, 'ar'),
            value: 'ar',
        },
        {
            label: create_option_data_text_val(true, 'am'),
            value: 'am',
        },
        {
            label: create_option_data_text_val(true, 'bg'),
            value: 'bg',
        },
        {
            label: create_option_data_text_val(true, 'bn'),
            value: 'bn',
        },
        {
            label: create_option_data_text_val(true, 'ca'),
            value: 'ca',
        },
        {
            label: create_option_data_text_val(true, 'cs'),
            value: 'cs',
        },
        {
            label: create_option_data_text_val(true, 'da'),
            value: 'da',
        },
        {
            label: create_option_data_text_val(true, 'de'),
            value: 'de',
        },
        {
            label: create_option_data_text_val(true, 'el'),
            value: 'el',
        },
        {
            label: create_option_data_text_val(true, 'en'),
            value: 'en',
        },
        {
            label: create_option_data_text_val(true, 'en_GB'),
            value: 'en_GB',
        },
        {
            label: create_option_data_text_val(true, 'en_US'),
            value: 'en_US',
        },
        {
            label: create_option_data_text_val(true, 'es'),
            value: 'es',
        },
        {
            label: create_option_data_text_val(true, 'es_419'),
            value: 'es_419',
        },
        {
            label: create_option_data_text_val(true, 'et'),
            value: 'et',
        },
        {
            label: create_option_data_text_val(true, 'fa'),
            value: 'fa',
        },
        {
            label: create_option_data_text_val(true, 'fi'),
            value: 'fi',
        },
        {
            label: create_option_data_text_val(true, 'fil'),
            value: 'fil',
        },
        {
            label: create_option_data_text_val(true, 'fr'),
            value: 'fr',
        },
        {
            label: create_option_data_text_val(true, 'gu'),
            value: 'gu',
        },
        {
            label: create_option_data_text_val(true, 'he'),
            value: 'he',
        },
        {
            label: create_option_data_text_val(true, 'hi'),
            value: 'hi',
        },
        {
            label: create_option_data_text_val(true, 'hr'),
            value: 'hr',
        },
        {
            label: create_option_data_text_val(true, 'hu'),
            value: 'hu',
        },
        {
            label: create_option_data_text_val(true, 'id'),
            value: 'id',
        },
        {
            label: create_option_data_text_val(true, 'it'),
            value: 'it',
        },
        {
            label: create_option_data_text_val(true, 'ja'),
            value: 'ja',
        },
        {
            label: create_option_data_text_val(true, 'kn'),
            value: 'kn',
        },
        {
            label: create_option_data_text_val(true, 'ko'),
            value: 'ko',
        },
        {
            label: create_option_data_text_val(true, 'lt'),
            value: 'lt',
        },
        {
            label: create_option_data_text_val(true, 'lv'),
            value: 'lv',
        },
        {
            label: create_option_data_text_val(true, 'ml'),
            value: 'ml',
        },
        {
            label: create_option_data_text_val(true, 'mr'),
            value: 'mr',
        },
        {
            label: create_option_data_text_val(true, 'ms'),
            value: 'ms',
        },
        {
            label: create_option_data_text_val(true, 'nl'),
            value: 'nl',
        },
        {
            label: create_option_data_text_val(true, 'no'),
            value: 'no',
        },
        {
            label: create_option_data_text_val(true, 'pl'),
            value: 'pl',
        },
        {
            label: create_option_data_text_val(true, 'pt_BR'),
            value: 'pt_BR',
        },
        {
            label: create_option_data_text_val(true, 'pt_PT'),
            value: 'pt_PT',
        },
        {
            label: create_option_data_text_val(true, 'ro'),
            value: 'ro',
        },
        {
            label: create_option_data_text_val(true, 'ru'),
            value: 'ru',
        },
        {
            label: create_option_data_text_val(true, 'sk'),
            value: 'sk',
        },
        {
            label: create_option_data_text_val(true, 'sl'),
            value: 'sl',
        },
        {
            label: create_option_data_text_val(true, 'sr'),
            value: 'sr',
        },
        {
            label: create_option_data_text_val(true, 'sv'),
            value: 'sv',
        },
        {
            label: create_option_data_text_val(true, 'sw'),
            value: 'sw',
        },
        {
            label: create_option_data_text_val(true, 'ta'),
            value: 'ta',
        },
        {
            label: create_option_data_text_val(true, 'te'),
            value: 'te',
        },
        {
            label: create_option_data_text_val(true, 'th'),
            value: 'th',
        },
        {
            label: create_option_data_text_val(true, 'tr'),
            value: 'tr',
        },
        {
            label: create_option_data_text_val(true, 'uk'),
            value: 'uk',
        },
        {
            label: create_option_data_text_val(true, 'vi'),
            value: 'vi',
        },
        {
            label: create_option_data_text_val(true, 'zh_CN'),
            value: 'zh_CN',
        },
        {
            label: create_option_data_text_val(true, 'zh_TW'),
            value: 'zh_TW',
        },
    ],
    ntp_background_alignment: [
        {
            label: create_option_data_text_val(false, 'default'),
            value: 'default',
        },
        {
            label: create_option_data_text_val(false, 'top'),
            value: 'top',
        },
        {
            label: create_option_data_text_val(false, 'center'),
            value: 'center',
        },
        {
            label: create_option_data_text_val(false, 'bottom'),
            value: 'bottom',
        },
        {
            label: create_option_data_text_val(false, 'left_top'),
            value: 'left top',
        },
        {
            label: create_option_data_text_val(false, 'left_center'),
            value: 'left center',
        },
        {
            label: create_option_data_text_val(false, 'left_bottom'),
            value: 'left bottom',
        },
        {
            label: create_option_data_text_val(false, 'right_top'),
            value: 'right top',
        },
        {
            label: create_option_data_text_val(false, 'right_center'),
            value: 'right center',
        },
        {
            label: create_option_data_text_val(false, 'right_bottom'),
            value: 'right bottom',
        },
    ],
    ntp_background_repeat: [
        {
            label: create_option_data_text_val(false, 'default'),
            value: 'default',
        },
        {
            label: create_option_data_text_val(false, 'repeat'),
            value: 'repeat',
        },
        {
            label: create_option_data_text_val(false, 'repeat_y'),
            value: 'repeat-y',
        },
        {
            label: create_option_data_text_val(false, 'repeat_x'),
            value: 'repeat-x',
        },
        {
            label: create_option_data_text_val(false, 'no_repeat'),
            value: 'no-repeat',
        },
    ],
    ntp_logo_alternate: [
        {
            label: create_option_data_text_val(false, 'default'),
            value: 'default',
        },
        {
            label: create_option_data_text_val(false, 'colorful'),
            value: '0',
        },
        {
            label: create_option_data_text_val(false, 'ntp_logo_alternate_white'),
            value: '1',
        },
    ],
    video_volume: create_video_volume_options(),
    size: [
        {
            label: create_option_data_text_val(false, 'default'),
            value: 'default',
        },
        {
            label: create_option_data_text_val(false, 'dont_resize'),
            value: 'dont_resize',
        },
        {
            label: create_option_data_text_val(false, 'fit_screen'),
            value: 'fit_screen',
        },
        {
            label: create_option_data_text_val(false, 'fit_browser'),
            value: 'fit_browser',
        },
        {
            label: create_option_data_text_val(false, 'cover_screen'),
            value: 'cover_screen',
        },
        {
            label: create_option_data_text_val(false, 'cover_browser'),
            value: 'cover_browser',
        },
        {
            label: create_option_data_text_val(false, 'stretch_screen'),
            value: 'stretch_screen',
        },
        {
            label: create_option_data_text_val(false, 'stretch_browser'),
            value: 'stretch_browser',
        },
    ],
    theme: [
        {
            label: create_option_data_text_val(false, 'dark'),
            value: 'dark',
        },
        {
            label: create_option_data_text_val(false, 'light'),
            value: 'light',
        },
    ],
    language: [
        {
            label: create_option_data_text_val(false, 'system'),
            value: 'system',
        },
        {
            label: create_option_data_text_val(true, 'en'),
            value: 'en',
        },
        {
            label: create_option_data_text_val(true, 'ru'),
            value: 'ru',
        },
    ],
};
