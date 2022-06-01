import React from 'react';
import { observer } from 'mobx-react';
import Svg from 'svg-inline-react';

import x from 'x';
import * as toggle_popup from 'js/toggle_popup';
import * as analytics from 'js/analytics';

import { Tr } from 'components/Tr';
import { Hr } from 'components/Hr';

import close_svg from 'svg/close.svg';

export const Popup = observer((props) => {
    const { name, children } = props;

    const on_click = () => {
        analytics.add_popup_close_btns_analytics(name);

        toggle_popup.close_all_popups();
    };

    return (
        <Tr
            attr={{
                className: x.cls(['popup', `${name}_popup`]),
            }}
            tag='div'
            name='gen'
            state={toggle_popup.ob.popup_visibility[name]}
        >
            <button className='close_btn' type='button' onClick={on_click}>
                <Svg src={close_svg} />
            </button>
            <Hr name={name} />
            <div className='popup_content'>{children}</div>
        </Tr>
    );
});
