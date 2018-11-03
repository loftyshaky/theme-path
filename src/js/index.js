import 'css/index.css';

import React from 'react';
import { render } from 'react-dom';

import 'js/err';

import { Err } from 'components/Err';

//--

render(
    <Err />, // eslint-disable-line react/jsx-filename-extension
    s('#err'),
);
