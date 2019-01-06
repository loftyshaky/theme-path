import React from 'react';
import { observer } from 'mobx-react';

import * as analytics from 'js/analytics';
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
                <div className="analytics_privacy_btns_and_link">
                    <Btn
                        name="allow_analytics"
                        on_click={() => analytics_privacy.allow_or_disallow_analytics(true, 'allow_analytics')}
                    />
                    <Btn
                        name="disallow_analytics"
                        on_click={() => analytics_privacy.allow_or_disallow_analytics(false, 'disallow_analytics')}
                    />
                    <a
                        className="privacy_policy_link"
                        href="https://bit.ly/ctc-privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        data-text="privacy_policy_link_text"
                        onClick={analytics.send_event.bind(null, 'links', 'clicked-clicked-analytics_privacy-privacy_policy_link')}
                    >
                        content
                    </a>
                </div>
            </Tr>
        );
    }
}

observer(Analytics_privacy);
