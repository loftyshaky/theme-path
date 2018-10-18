'use strict';

import close from 'svg/close';

import * as toogle_popup from 'js/toogle_popup';
import { Tr } from 'js/Tr';

import { Hr } from 'components/Hr';

import react from 'react';
import { observer } from "mobx-react";
import Svg from 'svg-inline-react';

export let Popup = props => {
    return (
        <Tr
            attr={{
                className: 'popup'
            }}
            tag='div'
            name='gen'
            state={toogle_popup.ob.popup_visibility[props.name]}
        >
            <button
                className='close_btn'
                onClick={toogle_popup.close_all_popups}
            >
                <Svg src={close} />
            </button>
            <Hr name={props.name} />
            <div className='popup_content'>
                {props.children}
            </div>
        </Tr>
    );
}

Popup = observer(Popup);