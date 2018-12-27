import React from 'react';
import { observer } from 'mobx-react';
import Svg from 'svg-inline-react';

import * as auto_update from 'js/auto_update';

import { Tr } from 'components/Tr';

import close_svg from 'svg/close';

export const Auto_updater = observer(() => (
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
        >
            <Svg src={close_svg} />
        </button>
        <div
            className="update_available_message"
            data-text="update_available_message_text"
        />
        <Auto_updater_btn
            name="install_update"
            on_click={auto_update.install_update}
        />
        <Auto_updater_btn
            name="postpone_update"
            on_click={() => auto_update.show_or_hide_auto_updater(false)}
        />
    </Tr>
));

const Auto_updater_btn = props => {
    const { name, on_click } = props;
    return (
        <button
            type="button"
            className="btn"
            data-text={`${name}_btn_text`}
            onClick={on_click}
        />
    );
};
