import React from 'react';
import { observer } from 'mobx-react';
import Svg from 'svg-inline-react';

import x from 'x';
import * as er from 'js/er';

import close_svg from 'svg/close';

//--

export class Er extends React.Component {
    componentDidMount() {
        window.addEventListener('load', () => {
            require('js/init_All'); // eslint-disable-line global-require
        });
    }

    render() {
        return (
            <div
                className={x.cls([
                    'er',
                    er.ob.er_is_visible ? '' : 'none',
                    er.ob.er_is_highlighted ? 'er_highlighted' : '',
                ])}
                role="none"
                onMouseDown={er.clear_all_timeouts}
            >
                <div className="er_msg">
                    {er.ob.er_msg}
                </div>
                <button
                    className="er_close_btn"
                    type="button"
                    onClick={er.change_er_state.bind(null, 'er_is_visible', false)}
                >
                    <Svg src={close_svg} />
                </button>
            </div>
        );
    }
}

observer(Er);
