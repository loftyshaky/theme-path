import React from 'react';
import { observer } from 'mobx-react';

import * as analytics_privacy from 'js/analytics_privacy';
import * as toggle_popup from 'js/toggle_popup';

import { Tr } from 'components/Tr';
import { Btn } from 'components/Btn';

export class Analytics_privacy extends React.Component {

    componentDidMount() {
        analytics_privacy.center_analytics_privacy();
    }

    render() {
        return (
            <Tr
                attr={{
                    className: 'popup analytics_privacy',
                }}
                tag="div"
                name="gen"
                state={toggle_popup.ob.analytics_privacy_is_visible}
            >
                <div
                    className="analytics_privacy_message"
                    data-text="analytics_privacy_message_text"
                />
                <Btn
                    name="allow_analytics"
                    on_click={() => analytics_privacy.allow_or_disallow_analytics(true, 'allow_analytics')}
                />
                <Btn
                    name="disallow_analytics"
                    on_click={() => analytics_privacy.allow_or_disallow_analytics(false, 'disallow_analytics')}
                />
            </Tr>
        );
    }
}

observer(Analytics_privacy);
