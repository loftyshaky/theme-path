import React from 'react';
import { observer } from 'mobx-react';

import * as toggle_popup from 'js/toggle_popup';

import { Tr } from 'components/Tr';

//--

export class Protecting_screen extends React.Component {
    componentDidMount() {
        try {
            this.protecting_screen.addEventListener('click', this.close_all_popups);

        } catch (er) {
            err(er, 104);
        }
    }

    componentWillUnmount() {
        try {
            this.protecting_screen.removeEventListener('click', this.close_all_popups);

        } catch (er) {
            err(er, 105);
        }
    }

    close_all_popups = () => {
        if (!toggle_popup.ob.analytics_privacy_is_visible) {
            toggle_popup.close_all_popups(true, 'clicked');
        }
    }

    render() {
        const { tr_name, state_key } = this.props;

        return (
            <div
                ref={protecting_screen => { this.protecting_screen = protecting_screen; }}
            >
                <Tr
                    attr={{
                        className: 'protecting_screen',
                    }}
                    tag="div"
                    name={tr_name}
                    state={toggle_popup.ob[state_key]}
                />
            </div>
        );
    }
}

observer(Protecting_screen);
