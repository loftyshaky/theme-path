import 'css/index.css';

import React from 'react';
import { render } from 'react-dom';

import 'js/error';
import * as analytics from 'js/analytics';

import { Error } from 'components/Error';

//--

analytics.send_pageview('main');
analytics.send_event('app_version', app_version);

render(
    <Error />, // eslint-disable-line react/jsx-filename-extension
    s('#err'),
);
