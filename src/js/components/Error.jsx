import React from 'react';
import { observer } from 'mobx-react';
import Svg from 'svg-inline-react';

import x from 'x';
import * as error from 'js/error';

import close_svg from 'svg/close.svg';

export class Error extends React.Component {
    componentDidMount() {
        try {
            require('js/init_All'); // eslint-disable-line global-require
        } catch (er) {
            err(er, 97);
        }
    }

    render() {
        return (
            <div
                className={x.cls([
                    'err',
                    error.ob.er_is_visible ? '' : 'none',
                    error.ob.er_is_highlighted ? 'er_highlighted' : '',
                ])}
                role='none'
                onMouseDown={error.clear_all_timeouts}
            >
                <div className='er_msg'>
                    {error.ob.er_msg}
                    <button
                        type='button'
                        className={x.cls([
                            'er_more_info_btn',
                            error.ob.more_info_is_visible ? 'none' : '',
                        ])}
                        onClick={error.show_or_hide_er_more_info.bind(null, true)}
                    >
                        {x.msg('er_more_info_btn_text')}
                    </button>
                    <div className={error.ob.more_info_is_visible ? '' : 'none'}>
                        {error.ob.er_msg_more_info}
                    </div>
                </div>
                <button
                    className='er_close_btn'
                    type='button'
                    onClick={error.change_er_state.bind(null, 'er_is_visible', false)}
                >
                    <Svg src={close_svg} />
                </button>
            </div>
        );
    }
}

observer(Error);
