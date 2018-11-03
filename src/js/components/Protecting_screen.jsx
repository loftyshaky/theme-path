import React from 'react';
import { observer } from 'mobx-react';

import * as toogle_popup from 'js/toogle_popup';

import { Tr } from 'components/Tr';

//--

export class Protecting_screen extends React.Component {
    componentDidMount() {
        try {
            this.protecting_screen.addEventListener('click', toogle_popup.close_all_popups);

        } catch (er) {
            err(er, 104);
        }
    }

    componentWillUnmount() {
        try {
            this.protecting_screen.removeEventListener('nv-event', toogle_popup.close_all_popups);

        } catch (er) {
            err(er, 105);
        }
    }

    render() {
        return (
            <div
                ref={protecting_screen => { this.protecting_screen = protecting_screen; }}
            >
                <Tr
                    attr={{
                        className: 'protecting_screen',
                    }}
                    tag="div"
                    name="gen"
                    state={toogle_popup.ob.proptecting_screen_is_visible}
                />
            </div>
        );
    }
}

observer(Protecting_screen);
