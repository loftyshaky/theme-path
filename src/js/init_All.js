import React from 'react';
import { render } from 'react-dom';

import x from 'x';
import 'js/set_defaults';
import * as settings from 'js/settings';

import { All } from 'components/All';

//--

settings.load_setting();
settings.load_theme();

//> render options page ui
render(
    <All />, // eslint-disable-line react/jsx-filename-extension
    s('#root'),
    async () => {
        try {
            //>1 remove no_tr css
            await x.delay(500);

            const no_tr = sb(document.head, '.no_tr');

            x.remove(no_tr);
            //<1 remove no_tr css

        } catch (er) {
            err(er, 44);
        }
    },
);

x.localize(document);
//< render options page ui
