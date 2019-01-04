import React from 'react';
import { observer } from 'mobx-react';
import Svg from 'svg-inline-react';

import * as toggle_popup from 'js/toggle_popup';
import * as analytics from 'js/analytics';

import { Tr } from 'components/Tr';
import { Hr } from 'components/Hr';

import close_svg from 'svg/close';

//--

export const Popup = observer(props => {
    const { name, children } = props;

    const on_click = () => {
        analytics.send_event('popup_close_btns', `clicked-${name}`);

        toggle_popup.close_all_popups();
    };

    return (
        <Tr
            attr={{
                className: 'popup',
            }}
            tag="div"
            name="gen"
            state={toggle_popup.ob.popup_visibility[name]}
        >
            <button
                className="close_btn"
                type="button"
                onClick={on_click}
            >
                <Svg src={close_svg} />
            </button>
            <Hr name={name} />
            <div className="popup_content">
                {children}
            </div>
        </Tr>
    );
});
