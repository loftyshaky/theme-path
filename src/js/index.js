import 'css/index.css';

import React from 'react';
import { render } from 'react-dom';

import 'js/error';

import { Error } from 'components/Error';

//--

render(
    <Error />, // eslint-disable-line react/jsx-filename-extension
    s('#err'),
);
