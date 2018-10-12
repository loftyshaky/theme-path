'use strict';

import { Popup } from 'components/Popup';
import { Select } from 'components/Select';
import { Textarea } from 'components/Textarea';

import react from 'react';

export const Settings = props => {
    return (
        <Popup name='settings'>
            <Select
                name='theme'
                input_type='settings'
            />
            <Textarea
                name='chrome_user_data_dirs'
                add_help
            />
        </Popup>
    );
}