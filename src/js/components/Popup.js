'use strict';

import close from 'svg/close';

import { Hr } from 'components/Hr';

import react from 'react';
import Svg from 'svg-inline-react';

export const Popup = props => {
    return (
        <div className='popup'>
            <button className='close_btn'><Svg src={close} /></button>
            <Hr name={props.name} />
            <div className='popup_content'>
                {props.children}
            </div>
        </div>
    );
}