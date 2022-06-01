import 'css/index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import 'js/settings';
import 'js/error';
import 'js/close_prompt';
import * as analytics from 'js/analytics';

import { Error } from 'components/Error';

analytics.track_app_start();

ReactDOM.createRoot(s('#err')).render(
    <Error />, // eslint-disable-line react/jsx-filename-extension
);
