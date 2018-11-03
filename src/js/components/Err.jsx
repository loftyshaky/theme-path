import React from 'react';
import { observer } from 'mobx-react';
import Svg from 'svg-inline-react';

import x from 'x';
import * as err from 'js/err';

import close_svg from 'svg/close';

//--

export class Err extends React.Component {
    componentDidMount() {
        try {
            window.addEventListener('load', () => {
                require('js/init_All'); // eslint-disable-line global-require
            });

        } catch (er) {
            err(er, 97);
        }
    }

    render() {
        return (
            <div
                className={x.cls([
                    'err',
                    err.ob.er_is_visible ? '' : 'none',
                    err.ob.er_is_highlighted ? 'er_highlighted' : '',
                ])}
                role="none"
                onMouseDown={err.clear_all_timeouts}
            >
                <div className="er_msg">
                    {err.ob.er_msg}
                </div>
                <button
                    className="er_close_btn"
                    type="button"
                    onClick={err.change_er_state.bind(null, 'er_is_visible', false)}
                >
                    <Svg src={close_svg} />
                </button>
            </div>
        );
    }
}

observer(Err);
