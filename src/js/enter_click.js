import * as color_pickiers from 'js/color_pickiers';

export const con = {
    enter_key_code: 13,
};

export const simulate_mouse_up_on_enter = (e) => {
    try {
        if (e.keyCode === con.enter_key_code) {
            const click_event = document.createEvent('MouseEvents');

            click_event.initEvent('mouseup', true, true);
            document.activeElement.dispatchEvent(click_event);
        }
    } catch (er) {
        err(er, 290);
    }
};

export const simulate_click_on_enter = (e) => {
    try {
        if (e.keyCode === con.enter_key_code) {
            document.activeElement.click();
        }
    } catch (er) {
        err(er, 177);
    }
};

export const open_color_pickier_on_enter = (e) => {
    try {
        if (e.keyCode === con.enter_key_code) {
            const color_input_vizualization = document.activeElement;
            const event = { target: color_input_vizualization };

            color_pickiers.show_or_hide_color_pickier_when_clicking_on_color_input_vizualization(
                event,
            );
        }
    } catch (er) {
        err(er, 178);
    }
};
