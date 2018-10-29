'use strict';

import x from 'x';

//--

//> create select text content t
const create_option_data_text_val = modifier => {
    return x.message('option_' + modifier + '_text');
}
//< create select text content t

export const selects_options = {
    locale: [
        {
            key: x.unique_id(),
            text: create_option_data_text_val('ar'),
            name: 'locale',
            val: 'ar'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('am'),
            name: 'locale',
            val: 'am'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('bg'),
            name: 'locale',
            val: 'bg'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('bn'),
            name: 'locale',
            val: 'bn'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('ca'),
            name: 'locale',
            val: 'ca'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('cs'),
            name: 'locale',
            val: 'cs'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('da'),
            name: 'locale',
            val: 'da'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('de'),
            name: 'locale',
            val: 'de'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('el'),
            name: 'locale',
            val: 'el'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('en'),
            name: 'locale',
            val: 'en'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('en_GB'),
            name: 'locale',
            val: 'en_GB'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('en_US'),
            name: 'locale',
            val: 'en_US'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('es'),
            name: 'locale',
            val: 'es'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('es_419'),
            name: 'locale',
            val: 'es_419'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('et'),
            name: 'locale',
            val: 'et'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('fa'),
            name: 'locale',
            val: 'fa'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('fi'),
            name: 'locale',
            val: 'fi'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('fil'),
            name: 'locale',
            val: 'fil'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('fr'),
            name: 'locale',
            val: 'fr'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('gu'),
            name: 'locale',
            val: 'gu'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('he'),
            name: 'locale',
            val: 'he'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('hi'),
            name: 'locale',
            val: 'hi'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('hr'),
            name: 'locale',
            val: 'hr'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('hu'),
            name: 'locale',
            val: 'hu'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('id'),
            name: 'locale',
            val: 'id'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('it'),
            name: 'locale',
            val: 'it'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('ja'),
            name: 'locale',
            val: 'ja'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('kn'),
            name: 'locale',
            val: 'kn'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('ko'),
            name: 'locale',
            val: 'ko'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('lt'),
            name: 'locale',
            val: 'lt'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('lv'),
            name: 'locale',
            val: 'lv'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('ml'),
            name: 'locale',
            val: 'ml'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('mr'),
            name: 'locale',
            val: 'mr'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('ms'),
            name: 'locale',
            val: 'ms'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('nl'),
            name: 'locale',
            val: 'nl'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('no'),
            name: 'locale',
            val: 'no'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('pl'),
            name: 'locale',
            val: 'pl'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('pt_BR'),
            name: 'locale',
            val: 'pt_BR'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('pt_PT'),
            name: 'locale',
            val: 'pt_PT'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('ro'),
            name: 'locale',
            val: 'ro'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('ru'),
            name: 'locale',
            val: 'ru'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('sk'),
            name: 'locale',
            val: 'sk'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('sl'),
            name: 'locale',
            val: 'sl'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('sr'),
            name: 'locale',
            val: 'sr'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('sv'),
            name: 'locale',
            val: 'sv'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('sw'),
            name: 'locale',
            val: 'sw'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('ta'),
            name: 'locale',
            val: 'ta'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('te'),
            name: 'locale',
            val: 'te'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('th'),
            name: 'locale',
            val: 'th'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('tr'),
            name: 'locale',
            val: 'tr'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('uk'),
            name: 'locale',
            val: 'uk'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('vi'),
            name: 'locale',
            val: 'vi'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('zh_CN'),
            name: 'locale',
            val: 'zh_CN'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('zh_TW'),
            name: 'locale',
            val: 'zh_TW'
        }
    ],
    ntp_background_alignment: [
        {
            key: x.unique_id(),
            text: create_option_data_text_val('default'),
            name: 'ntp_background_alignment',
            val: 'default'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('top'),
            name: 'ntp_background_alignment',
            val: 'top'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('center'),
            name: 'ntp_background_alignment',
            val: 'center'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('bottom'),
            name: 'ntp_background_alignment',
            val: 'bottom'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('left_top'),
            name: 'ntp_background_alignment',
            val: 'left top'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('left_center'),
            name: 'ntp_background_alignment',
            val: 'left center'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('left_bottom'),
            name: 'ntp_background_alignment',
            val: 'left bottom'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('right_top'),
            name: 'ntp_background_alignment',
            val: 'right top'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('right_center'),
            name: 'ntp_background_alignment',
            val: 'right center'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('right_bottom'),
            name: 'ntp_background_alignment',
            val: 'right bottom'
        }
    ],
    ntp_background_repeat: [
        {
            key: x.unique_id(),
            text: create_option_data_text_val('default'),
            name: 'ntp_background_repeat',
            val: 'default'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('repeat'),
            name: 'ntp_background_repeat',
            val: 'repeat'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('repeat_y'),
            name: 'ntp_background_repeat',
            val: 'repeat-y'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('repeat_x'),
            name: 'ntp_background_repeat',
            val: 'repeat-x'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('no_repeat'),
            name: 'ntp_background_repeat',
            val: 'no-repeat'
        },
    ],
    ntp_logo_alternate: [
        {
            key: x.unique_id(),
            text: create_option_data_text_val('default'),
            name: 'ntp_logo_alternate',
            val: 'default'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('colorful'),
            name: 'ntp_logo_alternate',
            val: '0'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('ntp_logo_alternate_white'),
            name: 'ntp_logo_alternate',
            val: '1'
        },
    ],
    theme: [
        {
            key: x.unique_id(),
            text: create_option_data_text_val('dark'),
            name: 'theme',
            val: 'dark'
        },
        {
            key: x.unique_id(),
            text: create_option_data_text_val('light'),
            name: 'theme',
            val: 'light'
        }
    ]
};