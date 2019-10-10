import React from 'react';
import { observer } from 'mobx-react';

import x from 'x';
import * as toggle_popup from 'js/toggle_popup';
import * as els_state from 'js/els_state';
import * as history from 'js/history';
import * as bulk_copy from 'js/bulk_copy';

import { Tr } from 'components/Tr';

export class Protecting_screen extends React.Component {
    constructor(props) {
        super(props);

        ({
            tr_name: this.tr_name,
            state_key: this.state_key,
        } = this.props);
    }

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
        return (
            <div
                ref={protecting_screen => { this.protecting_screen = protecting_screen; }}
            >
                <Tr
                    attr={{
                        className: 'protecting_screen',
                    }}
                    tag="div"
                    name={this.tr_name}
                    state={toggle_popup.ob[this.state_key]}
                />
            </div>
        );
    }
}

export const History_fieldset_protecting_screen = observer(props => {
    const { name } = props;

    return (
        <div
            className={x.cls(['history_fieldset_protecting_screen', history.ob.history_is_visible || bulk_copy.ob.bulk_copy_is_visible || (name === 'work_folder' && els_state.ob.applying_textarea_val) ? null : 'none'])}
        />
    );
});

observer(Protecting_screen);
