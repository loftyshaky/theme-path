import x from 'x';

//--

//> create select label content t
const create_option_data_text_val = modifier => {
    try {
        return x.message(`option_${modifier}_text`);

    } catch (er) {
        err(er, 48);
    }

    return undefined;
};
//< create select label content t

export const selects_options = {
    locale: [
        {
            label: create_option_data_text_val('ar'),
            value: 'ar',
        },
        {
            label: create_option_data_text_val('am'),
            value: 'am',
        },
        {
            label: create_option_data_text_val('bg'),
            value: 'bg',
        },
        {
            label: create_option_data_text_val('bn'),
            value: 'bn',
        },
        {
            label: create_option_data_text_val('ca'),
            value: 'ca',
        },
        {
            label: create_option_data_text_val('cs'),
            value: 'cs',
        },
        {
            label: create_option_data_text_val('da'),
            value: 'da',
        },
        {
            label: create_option_data_text_val('de'),
            value: 'de',
        },
        {
            label: create_option_data_text_val('el'),
            value: 'el',
        },
        {
            label: create_option_data_text_val('en'),
            value: 'en',
        },
        {
            label: create_option_data_text_val('en_GB'),
            value: 'en_GB',
        },
        {
            label: create_option_data_text_val('en_US'),
            value: 'en_US',
        },
        {
            label: create_option_data_text_val('es'),
            value: 'es',
        },
        {
            label: create_option_data_text_val('es_419'),
            value: 'es_419',
        },
        {
            label: create_option_data_text_val('et'),
            value: 'et',
        },
        {
            label: create_option_data_text_val('fa'),
            value: 'fa',
        },
        {
            label: create_option_data_text_val('fi'),
            value: 'fi',
        },
        {
            label: create_option_data_text_val('fil'),
            value: 'fil',
        },
        {
            label: create_option_data_text_val('fr'),
            value: 'fr',
        },
        {
            label: create_option_data_text_val('gu'),
            value: 'gu',
        },
        {
            label: create_option_data_text_val('he'),
            value: 'he',
        },
        {
            label: create_option_data_text_val('hi'),
            value: 'hi',
        },
        {
            label: create_option_data_text_val('hr'),
            value: 'hr',
        },
        {
            label: create_option_data_text_val('hu'),
            value: 'hu',
        },
        {
            label: create_option_data_text_val('id'),
            value: 'id',
        },
        {
            label: create_option_data_text_val('it'),
            value: 'it',
        },
        {
            label: create_option_data_text_val('ja'),
            value: 'ja',
        },
        {
            label: create_option_data_text_val('kn'),
            value: 'kn',
        },
        {
            label: create_option_data_text_val('ko'),
            value: 'ko',
        },
        {
            label: create_option_data_text_val('lt'),
            value: 'lt',
        },
        {
            label: create_option_data_text_val('lv'),
            value: 'lv',
        },
        {
            label: create_option_data_text_val('ml'),
            value: 'ml',
        },
        {
            label: create_option_data_text_val('mr'),
            value: 'mr',
        },
        {
            label: create_option_data_text_val('ms'),
            value: 'ms',
        },
        {
            label: create_option_data_text_val('nl'),
            value: 'nl',
        },
        {
            label: create_option_data_text_val('no'),
            value: 'no',
        },
        {
            label: create_option_data_text_val('pl'),
            value: 'pl',
        },
        {
            label: create_option_data_text_val('pt_BR'),
            value: 'pt_BR',
        },
        {
            label: create_option_data_text_val('pt_PT'),
            value: 'pt_PT',
        },
        {
            label: create_option_data_text_val('ro'),
            value: 'ro',
        },
        {
            label: create_option_data_text_val('ru'),
            value: 'ru',
        },
        {
            label: create_option_data_text_val('sk'),
            value: 'sk',
        },
        {
            label: create_option_data_text_val('sl'),
            value: 'sl',
        },
        {
            label: create_option_data_text_val('sr'),
            value: 'sr',
        },
        {
            label: create_option_data_text_val('sv'),
            value: 'sv',
        },
        {
            label: create_option_data_text_val('sw'),
            value: 'sw',
        },
        {
            label: create_option_data_text_val('ta'),
            value: 'ta',
        },
        {
            label: create_option_data_text_val('te'),
            value: 'te',
        },
        {
            label: create_option_data_text_val('th'),
            value: 'th',
        },
        {
            label: create_option_data_text_val('tr'),
            value: 'tr',
        },
        {
            label: create_option_data_text_val('uk'),
            value: 'uk',
        },
        {
            label: create_option_data_text_val('vi'),
            value: 'vi',
        },
        {
            label: create_option_data_text_val('zh_CN'),
            value: 'zh_CN',
        },
        {
            label: create_option_data_text_val('zh_TW'),
            value: 'zh_TW',
        },
    ],
    ntp_background_alignment: [
        {
            label: create_option_data_text_val('default'),
            value: 'default',
        },
        {
            label: create_option_data_text_val('top'),
            value: 'top',
        },
        {
            label: create_option_data_text_val('center'),
            value: 'center',
        },
        {
            label: create_option_data_text_val('bottom'),
            value: 'bottom',
        },
        {
            label: create_option_data_text_val('left_top'),
            value: 'left top',
        },
        {
            label: create_option_data_text_val('left_center'),
            value: 'left center',
        },
        {
            label: create_option_data_text_val('left_bottom'),
            value: 'left bottom',
        },
        {
            label: create_option_data_text_val('right_top'),
            value: 'right top',
        },
        {
            label: create_option_data_text_val('right_center'),
            value: 'right center',
        },
        {
            label: create_option_data_text_val('right_bottom'),
            value: 'right bottom',
        },
    ],
    ntp_background_repeat: [
        {
            label: create_option_data_text_val('default'),
            value: 'default',
        },
        {
            label: create_option_data_text_val('repeat'),
            value: 'repeat',
        },
        {
            label: create_option_data_text_val('repeat_y'),
            value: 'repeat-y',
        },
        {
            label: create_option_data_text_val('repeat_x'),
            value: 'repeat-x',
        },
        {
            label: create_option_data_text_val('no_repeat'),
            value: 'no-repeat',
        },
    ],
    ntp_logo_alternate: [
        {
            label: create_option_data_text_val('default'),
            value: 'default',
        },
        {
            label: create_option_data_text_val('colorful'),
            value: '0',
        },
        {
            label: create_option_data_text_val('ntp_logo_alternate_white'),
            value: '1',
        },
    ],
    theme: [
        {
            label: create_option_data_text_val('dark'),
            value: 'dark',
        },
        {
            label: create_option_data_text_val('light'),
            value: 'light',
        },
    ],
};
