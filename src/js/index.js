'use strict';

import 'css/index.css';

import x from 'x';

import 'js/set_defaults';
import * as settings from 'js/settings';

import { All } from 'components/All';

import React from 'react';
import { render } from 'react-dom';

//--

settings.load_setting();
settings.load_theme();

//> render options page ui t
render(
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