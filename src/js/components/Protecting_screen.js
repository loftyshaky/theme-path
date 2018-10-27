'use strict';

import { Tr } from 'js/Tr';

import * as toogle_popup from 'js/toogle_popup';

import react from 'react';
import react_dom from 'react-dom';
import { observer } from 'mobx-react';

export class Protecting_screen extends react.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        react_dom.findDOMNode(this).addEventListener('click', toogle_popup.close_all_popups);
    }

    componentWillUnmount() {
        react_dom.findDOMNode(this).removeEventListener('nv-event', toogle_popup.close_all_popups);
    }

    render() {
        return (
            <Tr
                attr={{
                    className: 'protecting_screen'
                }}
                tag='div'
                name='gen'
                state={toogle_popup.ob.proptecting_screen_is_visible}
            >
            </Tr>
        );
    }
}

Protecting_screen = observer(Protecting_screen);