import { remote } from 'electron';

import x from 'x';

export const generate_confirm_options = (msg, confirm_button) => {
    try {
        const dialog_options = {
            type: 'question',
            title: x.msg('confirm_title'),
            buttons: [
                x.msg(confirm_button),
                x.msg('confirm_answer_cancel'),
            ],
            message: x.msg(msg),
        };

        return dialog_options;

    } catch (er) {
        err(er, 286);
    }

    return undefined;
};

export const con = {
    win: remote.getCurrentWindow(),
};
