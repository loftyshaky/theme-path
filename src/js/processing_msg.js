
import { observable, action, configure } from 'mobx';

configure({ enforceActions: 'observed' });


export const process = action(callback => {
    try {
        if (!ob.processing_msg_is_visible) {
            mut.processing = true;
        }

        mut.process_callback = callback;

        change_processing_message_visibility();

    } catch (er) {
        err(er, 293);
    }
});

export const change_processing_message_visibility = action(() => {
    try {
        ob.processing_msg_is_visible = !ob.processing_msg_is_visible;

    } catch (er) {
        err(er, 294);
    }
});

export const ob = observable({
    processing_msg_is_visible: false,
});

export const mut = {
    processing: false,
    process_callback: null,
};
