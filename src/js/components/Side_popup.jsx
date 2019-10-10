import React from 'react';
import { observer } from 'mobx-react';
import Svg from 'svg-inline-react';

import * as bulk_copy from 'js/bulk_copy';

import { Tr } from 'components/Tr';
import { Btn } from 'components/Btn';
import { Hr } from 'components/Hr';

import close_svg from 'svg/close';

export class Side_popup extends React.Component {
    render() {
        const { children, name, popup_is_visible, additional_btns, close_f, accept_f, cancel_f } = this.props;

        return (
            <Tr
                attr={{
                    className: `popup side_popup ${name}_side_popup`,
                }}
                tag="div"
                name="gen"
                state={popup_is_visible}
            >
                <button
                    className="close_btn"
                    type="button"
                    onClick={close_f}
                >
                    <Svg src={close_svg} />
                </button>
                <Hr name={name} />
                <div className={`side_popup_content ${name}_side_popup_content`}>
                    {children}
                </div>
                {
                    name === 'bulk_copy' ? (
                        <Tr
                            attr={{
                                className: 'bulk_copy_set_default_message',
                                'data-text': 'bulk_copy_set_default_message_text',
                            }}
                            tag="p"
                            name="gen"
                            state={bulk_copy.ob.set_default_mode_is_activated}
                        />
                    ) : null
                }
                <div className={`side_popup_btns ${name}_side_popup_btns`}>
                    <Btn
                        name="side_popup_accept"
                        on_click={accept_f}
                    />
                    <Btn
                        name="side_popup_cancel"
                        on_click={cancel_f}
                    />
                    {
                        additional_btns.map(btn => (
                            <Btn
                                key={btn.key}
                                name={btn.name}
                                on_click={btn.on_click}
                            />
                        ))
                    }
                </div>
            </Tr>
        );
    }
}

observer(Side_popup);
