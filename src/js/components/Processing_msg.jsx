import React from 'react';
import { observer } from 'mobx-react';

import x from 'x';
import * as processing_msg from 'js/processing_msg';

export class Processing_msg extends React.Component {
    componentDidUpdate() {
        if (processing_msg.mut.processing) {
            window.requestAnimationFrame(async () => {
                processing_msg.mut.processing = false;

                await x.delay(0);

                await processing_msg.mut.process_callback();

                processing_msg.change_processing_message_visibility();
            });
        }
    }

    render() {
        return (
            <div
                className={x.cls(['processing_msg', processing_msg.ob.processing_msg_is_visible ? '' : 'none'])}
                data-text="processing_message_text"
            />
        );
    }
}

observer(Processing_msg);
