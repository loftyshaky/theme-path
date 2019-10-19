import 'css/index.css';

import React from 'react';
import { render } from 'react-dom';

import 'js/settings';
import 'js/error';
import 'js/close_prompt';
import * as analytics from 'js/analytics';

import { Error } from 'components/Error';

analytics.track_app_start();

render(
    <Error />, // eslint-disable-line react/jsx-filename-extension
    s('#err'),
);
