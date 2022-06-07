import React from 'react';
import { observer } from 'mobx-react';

import x from 'x';
import * as processing_msg from 'js/processing_msg';

export class ProcessingMsg extends React.Component {
    componentDidUpdate() {
        if (processing_msg.mut.processing) {
            window.requestAnimationFrame(async () => {
                try {
                    processing_msg.mut.processing = false;

                    await x.delay(0);

                    await processing_msg.mut.process_callback();

                    processing_msg.change_processing_message_visibility();
                } catch (er) {
                    err(er, 343, '', true);
                    processing_msg.mut.processing = false;

                    processing_msg.change_processing_message_visibility();
                }
            });
        }
    }

    render() {
        return (
            <div
                className={x.cls([
                    'processing_msg',
                    processing_msg.ob.processing_msg_is_visible ? '' : 'none',
                ])}
            >
                <div data-text='processing_message_text' />
            </div>
        );
    }
}

observer(ProcessingMsg);
