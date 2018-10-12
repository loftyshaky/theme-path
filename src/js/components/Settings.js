'use strict';

import { Popup } from 'components/Popup';
import { Input_block } from 'components/Input_block';

import react from 'react';

export const Settings = props => {
    return (
        <Popup name='settings'>
            <Input_block
                name='settings'
            />
        </Popup>
    );
}