import React from 'react';
import { render } from 'react-dom';

import x from 'x';
import 'js/tab_focus';
import * as options from 'js/options';

import { All } from 'components/All';

options.load_setting();
options.load_theme();

//> render options page ui
render(
    <All />, // eslint-disable-line react/jsx-filename-extension
    s('#root'),
    async () => {
        try {
            //>1 remove no_tr css
            await x.delay(500);

            x.remove(s('.no_tr'));
            //<1 remove no_tr css

        } catch (er) {
            err(er, 44);
        }
    },
);

x.localize(document);
//< render options page ui
