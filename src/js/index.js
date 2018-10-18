'use strict';

import x from 'x';

import 'js/set_defaults';
import * as settings from 'js/settings'

import { All } from 'components/All';

import react from 'react';
import react_dom from 'react-dom';

import 'css/index.css';

settings.load_setting();

//> render options page ui t
react_dom.render(
  <All />,
  s('#root'),
  async () => {
    //>1 remove no_tr css t
    await x.delay(500);

    const no_tr = sb(document.head, '.no_tr');

    x.remove(no_tr);
    //<1 remove no_tr css t
  }
);

x.localize(document);
//< render options page ui t