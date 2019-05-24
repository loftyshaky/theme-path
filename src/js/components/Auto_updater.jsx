import React from 'react';
import { observer } from 'mobx-react';
import Svg from 'svg-inline-react';

import * as analytics from 'js/analytics';
import * as auto_update from 'js/auto_update';

import { Tr } from 'components/Tr';
import { Btn } from 'components/Btn';

import close_svg from 'svg/close';

export const Auto_updater = observer(() => {
    const postpone_update = () => {
        try {
            auto_update.show_or_hide_auto_updater(false);

            analytics.send_event('btns', 'clicked-auto_updater-postpone_update');

        } catch (er) {
            err(er, 170);
        }
    };

    const close_auto_updater = () => {
        try {
            auto_update.show_or_hide_auto_updater(false);

            analytics.add_popup_close_btns_analytics('auto_updater');

        } catch (er) {
            err(er, 217);
        }
    };

    return (
        <Tr
            attr={{
                className: 'popup auto_updater',
            }}
            tag="div"
            name="gen"
            state={auto_update.ob.auto_updater_visible}
        >
            <button
                className="close_btn"
                type="button"
                onClick={close_auto_updater}
            >
                <Svg src={close_svg} />
            </button>
            <div
                className="update_available_message"
                data-text="update_available_message_text"
            />
            <Btn
                name="install_update"
                on_click={auto_update.install_update}
            />
            <Btn
                name="postpone_update"
                on_click={postpone_update}
            />
        </Tr>
    );
});
