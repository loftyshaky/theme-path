import 'css/index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import 'js/settings';
import 'js/error';
import 'js/close_prompt';

import { Error } from 'components/Error';

ReactDOM.createRoot(s('#err')).render(
    <Error />, // eslint-disable-line react/jsx-filename-extension
);
